import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { config } from '../config';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const verifier = CognitoJwtVerifier.create({
    userPoolId: config.COGNITO_USER_POOL_ID,
    tokenUse: 'access',
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
        const payload = await verifier.verify(token);
        req.user = payload;
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Export as both authMiddleware and authenticate for compatibility
export const authenticate = authMiddleware;
