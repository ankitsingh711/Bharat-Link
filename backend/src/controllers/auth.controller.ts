import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import prisma from '../lib/prisma';

const authService = new AuthService();

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists in Prisma
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists in database. Please login instead.'
            });
        }

        // 1. Register in Cognito
        let cognitoRes;
        try {
            cognitoRes = await authService.signup(email, password, name);
        } catch (cognitoError: any) {
            // If user exists in Cognito but not in Prisma, create Prisma record
            if (cognitoError.name === 'UsernameExistsException') {
                console.log(`User ${email} exists in Cognito but not in Prisma. Creating Prisma record...`);

                // Create user in Prisma to sync with Cognito
                await prisma.user.create({
                    data: { email, name }
                });

                return res.status(409).json({
                    message: 'User already registered in Cognito. Database record created. Please verify your email or login.',
                    requiresVerification: true
                });
            }
            // Re-throw other Cognito errors
            throw cognitoError;
        }

        // 2. Create User in DB (Pending verification)
        await prisma.user.create({
            data: {
                email,
                name,
                // userSub: cognitoRes.UserSub // Store Cognito Sub if needed
            }
        });

        res.status(201).json({
            message: 'User registered successfully. Please verify your email.',
            userSub: cognitoRes.UserSub
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(400).json({ message: error.message || 'Signup failed' });
    }
};

export const verify = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        await authService.verify(email, code);
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Verification failed' });
    }
};

export const resendCode = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await authService.resendVerificationCode(email);
        res.status(200).json({ message: 'Verification code resent successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Failed to resend code' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.status(200).json({
            accessToken: result.AuthenticationResult?.AccessToken,
            idToken: result.AuthenticationResult?.IdToken,
            refreshToken: result.AuthenticationResult?.RefreshToken
        });
    } catch (error: any) {
        console.error('Login error:', error);

        // Provide specific error messages based on Cognito error codes
        if (error.name === 'UserNotConfirmedException') {
            return res.status(401).json({
                message: 'Email not verified. Please check your email for the verification code.',
                code: 'EMAIL_NOT_VERIFIED',
                email: req.body.email
            });
        }

        if (error.name === 'NotAuthorizedException') {
            return res.status(401).json({
                message: 'Incorrect email or password.',
                code: 'INVALID_CREDENTIALS'
            });
        }

        if (error.name === 'UserNotFoundException') {
            return res.status(401).json({
                message: 'User not found. Please sign up first.',
                code: 'USER_NOT_FOUND'
            });
        }

        res.status(401).json({ message: error.message || 'Login failed' });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        res.status(200).json({ message: 'Password reset code sent to your email' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        res.status(400).json({ message: error.message || 'Failed to send reset code' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, code, newPassword } = req.body;
        await authService.resetPassword(email, code, newPassword);
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        res.status(400).json({ message: error.message || 'Failed to reset password' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }

        const result = await authService.refreshToken(refreshToken);

        res.status(200).json({
            accessToken: result.AuthenticationResult?.AccessToken,
            idToken: result.AuthenticationResult?.IdToken,
        });
    } catch (error: any) {
        console.error('Token refresh error:', error);
        res.status(401).json({ message: error.message || 'Token refresh failed' });
    }
};
