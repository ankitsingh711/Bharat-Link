import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createJob = async (req: Request, res: Response) => {
    try {
        const { title, description, companyId, location, salaryRange, requirements } = req.body;
        const job = await prisma.job.create({
            data: {
                title,
                description,
                companyId,
                location,
                salaryRange,
                requirements,
                postedById: req.user.sub // Use the foreign key directly
            }
        });
        res.status(201).json(job);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getJobs = async (req: Request, res: Response) => {
    try {
        // Basic formatting for query params
        const { q, location } = req.query;
        const jobs = await prisma.job.findMany({
            where: {
                title: { contains: q as string, mode: 'insensitive' },
                location: { contains: location as string, mode: 'insensitive' }
            },
            include: { company: true }
        });
        res.json(jobs);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getJobById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id },
            include: { company: true, applications: false } // Don't expose apps publicly
        });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
