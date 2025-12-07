import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user.sub; // From Cognito token
        // In a real app, we might need to look up User by email or sub if ID differs
        // Here assuming we sync sub or use email to find user
        const user = await prisma.user.findFirst({
            where: { email: req.user.email }
        });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMe = async (req: Request, res: Response) => {
    try {
        const { headline, summary, location, skills } = req.body;
        // Basic update
        const user = await prisma.user.update({
            where: { email: req.user.email },
            data: {
                headline,
                summary,
                location,
                // skills would need relation update, simplistic here
            }
        });
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
