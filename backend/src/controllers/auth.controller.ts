import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import prisma from '../lib/prisma';

const authService = new AuthService();

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        // 1. Register in Cognito
        const cognitoRes = await authService.signup(email, password, name);

        // 2. Create User in DB (Pending verification)
        // Note: We might want to do this after verification or handle race conditions
        // For now, we'll create the user record
        await prisma.user.create({
            data: {
                email,
                name,
                // userSub: cognitoRes.UserSub // Store Cognito Sub if needed
            }
        });

        res.status(201).json({ message: 'User registered successfully. Please verify your email.', userSub: cognitoRes.UserSub });
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
        res.status(401).json({ message: error.message || 'Login failed' });
    }
};
