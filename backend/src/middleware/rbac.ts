import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Assuming role is stored in Cognito custom attribute 'custom:role' or groups
        // Adjust based on actual Cognito setup
        const userRole = req.user['custom:role'] || 'MEMBER';

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }

        next();
    };
};
