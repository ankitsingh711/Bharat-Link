import apiClient from '../client';
import type { Job, ApiResponse } from '@/types';

export const jobsApi = {
    /**
     * Get all jobs with optional search and filters
     */
    async getJobs(params?: {
        q?: string;
        location?: string;
        page?: number;
        limit?: number;
    }): Promise<Job[]> {
        const response = await apiClient.get('/jobs', { params });
        return response.data;
    },

    /**
     * Get job by ID
     */
    async getJobById(id: string): Promise<Job> {
        const response = await apiClient.get(`/jobs/${id}`);
        return response.data;
    },

    /**
     * Create new job posting
     */
    async createJob(data: Partial<Job>): Promise<Job> {
        const response = await apiClient.post('/jobs', data);
        return response.data;
    },

    /**
     * Update existing job
     */
    async updateJob(id: string, data: Partial<Job>): Promise<Job> {
        const response = await apiClient.put(`/jobs/${id}`, data);
        return response.data;
    },

    /**
     * Delete job posting
     */
    async deleteJob(id: string): Promise<void> {
        await apiClient.delete(`/jobs/${id}`);
    },

    /**
     * Apply to a job
     */
    async applyToJob(jobId: string, data: {
        resume?: string;
        coverLetter?: string;
    }): Promise<ApiResponse<any>> {
        const response = await apiClient.post(`/jobs/${jobId}/apply`, data);
        return response.data;
    },
};
