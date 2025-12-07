import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { config } from '../config';
import prisma from '../lib/prisma';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

// Create verifiers for both access and ID tokens
const accessTokenVerifier = CognitoJwtVerifier.create({
    userPoolId: config.COGNITO_USER_POOL_ID,
    tokenUse: 'access',
    clientId: config.COGNITO_CLIENT_ID,
});

const idTokenVerifier = CognitoJwtVerifier.create({
    userPoolId: config.COGNITO_USER_POOL_ID,
    tokenUse: 'id',
    clientId: config.COGNITO_CLIENT_ID,
});

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid authorization header format' });
    }

    try {
        // Try to verify as access token first, then ID token
        let payload;
        try {
            payload = await accessTokenVerifier.verify(token);
            console.log('Verified as access token');
        } catch (accessError) {
            // Try ID token
            payload = await idTokenVerifier.verify(token);
            console.log('Verified as ID token');
        }

        console.log('Token payload:', JSON.stringify(payload, null, 2));

        // Get email from token (ID tokens have it, access tokens might not)
        const email = payload['email'] as string;
        const cognitoSub = payload.sub;

        if (!email) {
            console.error('No email in token payload. Sub:', cognitoSub);
            return res.status(401).json({ message: 'Invalid token: no email claim' });
        }

        // Find user in database
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.error(`User not found in database for email: ${email}`);
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            cognitoSub,
            ...payload
        };
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Export as both authMiddleware and authenticate for compatibility
export const authenticate = authMiddleware;
