'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function JobsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    // Sample jobs data
    const sampleJobs = [
        {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'TechCorp India',
            location: 'Bangalore, Karnataka',
            salaryRange: '₹15-25 LPA',
            employmentType: 'Full-time',
            description: 'Looking for an experienced software engineer to join our growing team...',
            posted: '2 days ago',
        },
        {
            id: '2',
            title: 'Product Manager',
            company: 'StartupXYZ',
            location: 'Mumbai, Maharashtra',
            salaryRange: '₹20-35 LPA',
            employmentType: 'Full-time',
            description: 'Seeking a product manager with 5+ years of experience in B2B SaaS...',
            posted: '1 week ago',
        },
        {
            id: '3',
            title: 'Frontend Developer',
            company: 'WebSolutions Pvt Ltd',
            location: 'Hyderabad, Telangana',
            salaryRange: '₹10-18 LPA',
            employmentType: 'Full-time',
            description: 'Join our team as a frontend developer working with React and TypeScript...',
            posted: '3 days ago',
        },
        {
            id: '4',
            title: 'Data Scientist',
            company: 'AI Innovations',
            location: 'Pune, Maharashtra',
            salaryRange: '₹18-30 LPA',
            employmentType: 'Full-time',
            description: 'We are looking for a data scientist with expertise in machine learning...',
            posted: '5 days ago',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Next Opportunity</h1>

                    {/* Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by job title, company, or keywords"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="md:w-64">
                            <Input
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <Button>Search Jobs</Button>
                    </div>
                </div>
            </div>

            {/* Job Listings */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <aside className="md:w-64 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Employment Type</h4>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" />
                                        <span className="text-sm">Full-time</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" />
                                        <span className="text-sm">Part-time</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" />
                                        <span className="text-sm">Contract</span>
                                    </label>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Experience Level</h4>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" />
                                        <span className="text-sm">Entry Level</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" />
                                        <span className="text-sm">Mid Level</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" />
                                        <span className="text-sm">Senior Level</span>
                                    </label>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Job Cards */}
                    <div className="flex-1 space-y-4">
                        <p className="text-sm text-gray-600">{sampleJobs.length} jobs found</p>

                        {sampleJobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <Link href={`/jobs/${job.id}`}>
                                                <CardTitle className="text-xl hover:text-blue-600 cursor-pointer">
                                                    {job.title}
                                                </CardTitle>
                                            </Link>
                                            <CardDescription className="mt-1">
                                                {job.company} • {job.location}
                                            </CardDescription>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Save
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                                        <span className="flex items-center">
                                            💼 {job.employmentType}
                                        </span>
                                        <span className="flex items-center">
                                            💰 {job.salaryRange}
                                        </span>
                                        <span className="flex items-center">
                                            🕒 {job.posted}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 mb-4">{job.description}</p>
                                    <div className="flex gap-2">
                                        <Link href={`/jobs/${job.id}`}>
                                            <Button>View Details</Button>
                                        </Link>
                                        <Button variant="outline">Quick Apply</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
