'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useParams } from 'next/navigation';

export default function ProfilePage() {
    const { user } = useAuth();
    const params = useParams();
    const profileId = params.id as string;

    // For now, show current user's profile
    // Later this can fetch other users' profiles by ID
    const isOwnProfile = user?.id === profileId;

    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
                {/* Profile Header */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                            <Avatar src={user.profileImage} fallback={user.name} size="xl" className="ring-4 ring-orange-100" />
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                                <p className="text-lg text-gray-600 mb-4">{user.email}</p>
                                {isOwnProfile && (
                                    <Button variant="outline" className="cursor-pointer">
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* About Section */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50/50 to-green-50/50">
                        <h2 className="text-xl font-bold text-gray-900">About</h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to my profile! I'm passionate about building great products and connecting with professionals across India.
                        </p>
                    </CardContent>
                </Card>

                {/* Experience Section */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-gradient-to-r from-green-50/50 to-orange-50/50">
                        <h2 className="text-xl font-bold text-gray-900">Experience</h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            <div className="flex space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                                        TC
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">Software Engineer</h3>
                                    <p className="text-gray-600">TechCorp India</p>
                                    <p className="text-sm text-gray-500 mt-1">2022 - Present</p>
                                    <p className="text-gray-700 mt-2">
                                        Building scalable web applications and working with modern technologies.
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                                        SU
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">Junior Developer</h3>
                                    <p className="text-gray-600">StartupXYZ</p>
                                    <p className="text-sm text-gray-500 mt-1">2020 - 2022</p>
                                    <p className="text-gray-700 mt-2">
                                        Started my career building innovative solutions for startups.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skills Section */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50/50 to-green-50/50">
                        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex flex-wrap gap-2">
                            {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'AWS', 'MongoDB', 'PostgreSQL'].map((skill) => (
                                <span
                                    key={skill}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-100 to-green-100 text-gray-800 rounded-full text-sm font-medium hover:shadow-md transition-shadow cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Education Section */}
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-gradient-to-r from-green-50/50 to-orange-50/50">
                        <h2 className="text-xl font-bold text-gray-900">Education</h2>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                    IIT
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">B.Tech in Computer Science</h3>
                                <p className="text-gray-600">Indian Institute of Technology</p>
                                <p className="text-sm text-gray-500 mt-1">2016 - 2020</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
