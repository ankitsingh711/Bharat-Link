'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { useState } from 'react';

// Extended mock data for job details
const jobsData = {
    '1': {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp India',
        location: 'Bangalore, Karnataka',
        salaryRange: '₹15-25 LPA',
        employmentType: 'Full-time',
        experienceLevel: '5-8 years',
        remote: 'Hybrid',
        posted: '2 days ago',
        applicants: 45,
        description: `We are looking for a Senior Software Engineer to join our dynamic team in Bangalore. You will be working on cutting-edge technologies and building scalable solutions that impact millions of users across India.

As a Senior Software Engineer, you'll collaborate with cross-functional teams to design, develop, and deploy high-quality software solutions. You'll mentor junior developers and contribute to architectural decisions.`,
        responsibilities: [
            'Design and develop scalable backend services using Node.js and microservices architecture',
            'Write clean, maintainable, and well-tested code',
            'Collaborate with product managers and designers to understand requirements',
            'Mentor junior developers and conduct code reviews',
            'Participate in architectural discussions and technical planning',
            'Optimize application performance and scalability'
        ],
        requiredSkills: [
            'JavaScript/TypeScript',
            'Node.js',
            'React',
            'PostgreSQL',
            'AWS',
            'Docker',
            'Kubernetes',
            'Git'
        ],
        preferredSkills: [
            'GraphQL',
            'Redis',
            'Microservices',
            'CI/CD',
            'Agile/Scrum'
        ],
        qualifications: [
            'Bachelor\'s or Master\'s degree in Computer Science or related field',
            '5+ years of professional software development experience',
            'Strong problem-solving and analytical skills',
            'Excellent communication and teamwork abilities'
        ],
        benefits: [
            'Health Insurance (including family)',
            'Work from home flexibility',
            'Learning & Development budget',
            'Performance bonuses',
            'Paid time off and sick leaves',
            'Team outings and events',
            'Latest tech equipment',
            'Gym membership'
        ],
        companyInfo: {
            name: 'TechCorp India',
            size: '500-1000 employees',
            industry: 'Information Technology',
            description: 'TechCorp India is a leading technology company focused on building innovative solutions for the Indian market. We work with cutting-edge technologies and provide our employees with opportunities to grow and learn.',
            website: 'https://techcorp.in',
            founded: '2015'
        }
    },
    '2': {
        id: '2',
        title: 'Product Manager',
        company: 'StartupXYZ',
        location: 'Mumbai, Maharashtra',
        salaryRange: '₹20-35 LPA',
        employmentType: 'Full-time',
        experienceLevel: '5-10 years',
        remote: 'Remote',
        posted: '1 week ago',
        applicants: 32,
        description: `StartupXYZ is seeking an experienced Product Manager to lead our B2B SaaS product initiatives. You will be responsible for defining product strategy, working with engineering teams, and ensuring successful product launches.

In this role, you'll drive product vision, strategy, and roadmap while working closely with customers to understand their needs and pain points.`,
        responsibilities: [
            'Define and communicate product vision and strategy',
            'Conduct market research and competitive analysis',
            'Gather and prioritize product requirements',
            'Work closely with engineering teams to deliver products',
            'Define and track product success metrics',
            'Collaborate with sales and marketing teams'
        ],
        requiredSkills: [
            'Product Strategy',
            'Market Research',
            'Roadmap Planning',
            'Agile/Scrum',
            'Data Analysis',
            'Stakeholder Management',
            'B2B SaaS',
            'User Research'
        ],
        preferredSkills: [
            'SQL',
            'Analytics Tools',
            'A/B Testing',
            'UI/UX Design',
            'Technical Background'
        ],
        qualifications: [
            'MBA or equivalent experience',
            '5+ years of product management experience in B2B SaaS',
            'Proven track record of successful product launches',
            'Strong analytical and communication skills'
        ],
        benefits: [
            'Competitive salary with ESOPs',
            'Flexible work hours',
            'Remote work options',
            'Health and wellness programs',
            'Professional development opportunities',
            'Modern office space',
            'Unlimited books budget'
        ],
        companyInfo: {
            name: 'StartupXYZ',
            size: '50-100 employees',
            industry: 'SaaS',
            description: 'StartupXYZ is a fast-growing B2B SaaS company helping businesses streamline their operations. We offer a collaborative work environment and opportunities for rapid career growth.',
            website: 'https://startupxyz.com',
            founded: '2020'
        }
    },
    '3': {
        id: '3',
        title: 'Frontend Developer',
        company: 'WebSolutions Pvt Ltd',
        location: 'Hyderabad, Telangana',
        salaryRange: '₹10-18 LPA',
        employmentType: 'Full-time',
        experienceLevel: '3-5 years',
        remote: 'On-site',
        posted: '3 days ago',
        applicants: 28,
        description: `Join our team as a Frontend Developer and work on exciting projects using modern web technologies. You'll be building responsive, performant web applications that provide exceptional user experiences.

We're looking for someone passionate about frontend development, with a strong eye for design and attention to detail.`,
        responsibilities: [
            'Develop responsive web applications using React and TypeScript',
            'Implement pixel-perfect designs from Figma',
            'Optimize application performance and user experience',
            'Write unit and integration tests',
            'Collaborate with backend developers on API integration',
            'Participate in code reviews and team meetings'
        ],
        requiredSkills: [
            'React',
            'TypeScript',
            'HTML/CSS',
            'JavaScript',
            'Git',
            'REST APIs',
            'Responsive Design',
            'Redux/State Management'
        ],
        preferredSkills: [
            'Next.js',
            'TailwindCSS',
            'Testing Libraries',
            'Webpack',
            'Performance Optimization'
        ],
        qualifications: [
            'Bachelor\'s degree in Computer Science or related field',
            '3+ years of frontend development experience',
            'Strong portfolio of web applications',
            'Good understanding of web performance best practices'
        ],
        benefits: [
            'Health insurance',
            'Annual performance bonuses',
            'Learning opportunities',
            'Free lunch and snacks',
            'Friendly work environment',
            'Career growth opportunities'
        ],
        companyInfo: {
            name: 'WebSolutions Pvt Ltd',
            size: '100-200 employees',
            industry: 'Web Development',
            description: 'WebSolutions is a web development agency working with clients across various industries. We focus on building high-quality, user-friendly web applications.',
            website: 'https://websolutions.in',
            founded: '2018'
        }
    },
    '4': {
        id: '4',
        title: 'Data Scientist',
        company: 'AI Innovations',
        location: 'Pune, Maharashtra',
        salaryRange: '₹18-30 LPA',
        employmentType: 'Full-time',
        experienceLevel: '4-7 years',
        remote: 'Hybrid',
        posted: '5 days ago',
        applicants: 38,
        description: `AI Innovations is looking for a talented Data Scientist to join our AI/ML team. You will work on challenging problems involving large-scale data analysis, machine learning model development, and deployment.

This role offers the opportunity to work with state-of-the-art ML technologies and contribute to products that leverage artificial intelligence.`,
        responsibilities: [
            'Develop and deploy machine learning models',
            'Analyze large datasets to extract insights',
            'Collaborate with engineering teams on ML integration',
            'Conduct A/B tests and experiments',
            'Present findings to stakeholders',
            'Stay updated with latest ML research'
        ],
        requiredSkills: [
            'Python',
            'Machine Learning',
            'TensorFlow/PyTorch',
            'SQL',
            'Statistics',
            'Data Visualization',
            'Pandas/NumPy',
            'Scikit-learn'
        ],
        preferredSkills: [
            'Deep Learning',
            'NLP',
            'Computer Vision',
            'AWS/GCP',
            'MLOps'
        ],
        qualifications: [
            'Master\'s or PhD in Computer Science, Statistics, or related field',
            '4+ years of data science experience',
            'Strong mathematical and statistical background',
            'Published research papers (preferred)'
        ],
        benefits: [
            'Competitive compensation',
            'Research paper publication support',
            'Conference attendance sponsorship',
            'Flexible working hours',
            'Health insurance for family',
            'Stock options',
            'Latest ML hardware access'
        ],
        companyInfo: {
            name: 'AI Innovations',
            size: '200-500 employees',
            industry: 'Artificial Intelligence',
            description: 'AI Innovations is at the forefront of AI research and development in India. We build intelligent systems that solve real-world problems across various domains.',
            website: 'https://aiinnovations.in',
            founded: '2016'
        }
    }
};

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();
    const jobId = params.id as string;
    const [isSaved, setIsSaved] = useState(false);

    const job = jobsData[jobId as keyof typeof jobsData];

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
                        <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                        <Link href="/jobs">
                            <Button className="w-full cursor-pointer">Back to Jobs</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/jobs" className="hover:text-orange-600 transition-colors">Jobs</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{job.title}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header */}
                        <Card className="border-l-4 border-l-orange-500">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                                        <div className="flex items-center space-x-4 text-gray-600 mb-4">
                                            <span className="font-semibold text-orange-600">{job.company}</span>
                                            <span>•</span>
                                            <span className="flex items-center">
                                                📍 {job.location}
                                            </span>
                                            <span>•</span>
                                            <span>{job.remote}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                {job.employmentType}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                {job.experienceLevel}
                                            </span>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                💰 {job.salaryRange}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
                                    <span>Posted {job.posted}</span>
                                    <span>{job.applicants} applicants</span>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Job Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Job Description</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {job.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Responsibilities */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Key Responsibilities</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {job.responsibilities.map((resp, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <span className="text-orange-500 mt-1">✓</span>
                                            <span className="text-gray-700">{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Required Skills */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Required Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.requiredSkills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 rounded-lg font-medium text-sm border border-orange-200"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                {job.preferredSkills.length > 0 && (
                                    <>
                                        <h4 className="font-semibold text-gray-900 mb-3 mt-6">Preferred Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {job.preferredSkills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm border border-gray-200"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Qualifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Qualifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {job.qualifications.map((qual, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <span className="text-green-500 mt-1">🎓</span>
                                            <span className="text-gray-700">{qual}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Benefits */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Benefits & Perks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {job.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                                            <span className="text-green-600">✓</span>
                                            <span className="text-gray-700">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">About {job.companyInfo.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-700 leading-relaxed">{job.companyInfo.description}</p>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <p className="text-sm text-gray-600">Company Size</p>
                                        <p className="font-semibold text-gray-900">{job.companyInfo.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Industry</p>
                                        <p className="font-semibold text-gray-900">{job.companyInfo.industry}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Founded</p>
                                        <p className="font-semibold text-gray-900">{job.companyInfo.founded}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Website</p>
                                        <a
                                            href={job.companyInfo.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold text-orange-600 hover:text-orange-700"
                                        >
                                            Visit Website →
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Application Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <Card className="border-2 border-orange-200 shadow-lg">
                                <CardHeader>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900 mb-1">{job.salaryRange}</p>
                                        <p className="text-sm text-gray-600">Expected Salary Range</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant="gradient"
                                        className="w-full cursor-pointer text-lg py-6"
                                        onClick={() => alert('Application feature coming soon!')}
                                    >
                                        Apply Now
                                    </Button>
                                    <Button
                                        variant={isSaved ? 'primary' : 'outline'}
                                        className="w-full cursor-pointer"
                                        onClick={() => setIsSaved(!isSaved)}
                                    >
                                        {isSaved ? '✓ Saved' : '🔖 Save Job'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full cursor-pointer"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: job.title,
                                                    text: `Check out this job: ${job.title} at ${job.company}`,
                                                    url: window.location.href
                                                });
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert('Link copied to clipboard!');
                                            }
                                        }}
                                    >
                                        📤 Share Job
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Quick Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Job Type</span>
                                        <span className="font-semibold">{job.employmentType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Experience</span>
                                        <span className="font-semibold">{job.experienceLevel}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Work Mode</span>
                                        <span className="font-semibold">{job.remote}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Posted</span>
                                        <span className="font-semibold">{job.posted}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Applicants</span>
                                        <span className="font-semibold">{job.applicants}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Similar Jobs */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.values(jobsData)
                            .filter(j => j.id !== jobId)
                            .slice(0, 3)
                            .map((similarJob) => (
                                <Card key={similarJob.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="text-lg">{similarJob.title}</CardTitle>
                                        <p className="text-orange-600 font-semibold">{similarJob.company}</p>
                                        <p className="text-sm text-gray-600">{similarJob.location}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-semibold text-gray-900">{similarJob.salaryRange}</span>
                                            <span className="text-xs text-gray-600">{similarJob.posted}</span>
                                        </div>
                                        <Link href={`/jobs/${similarJob.id}`}>
                                            <Button variant="outline" className="w-full cursor-pointer">
                                                View Details
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
