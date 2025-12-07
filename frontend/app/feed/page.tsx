'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function FeedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
            {/* Navigation Header */}
            <header className="border-b bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Logo size="sm" />
                        <span className="text-xl font-bold gradient-text">Bharat Link</span>
                    </div>
                    <nav className="flex items-center space-x-6">
                        <Link href="/feed" className="text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                            Feed
                        </Link>
                        <Link href="/jobs" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                            Jobs
                        </Link>
                        <Link href="/profile" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">
                            Profile
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-6">
                    {/* Create Post Card */}
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex space-x-3">
                                <Avatar size="md" fallback="You" />
                                <input
                                    type="text"
                                    placeholder="Start a post..."
                                    className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl hover:border-orange-300 focus:border-orange-500 focus:outline-none transition-colors cursor-pointer"
                                    readOnly
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Posts Feed */}
                    <div className="space-y-5">
                        {/* Sample Post 1 */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-start space-x-4 p-5">
                                <Avatar size="md" fallback="John Doe" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">John Doe</h4>
                                    <p className="text-sm text-gray-600">Software Engineer at TechCorp</p>
                                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                                </div>
                            </CardHeader>
                            <CardContent className="px-5 pb-5">
                                <p className="text-gray-800 mb-5 leading-relaxed">
                                    Excited to announce that I've joined TechCorp as a Senior Software Engineer!
                                    Looking forward to working with an amazing team building innovative solutions.
                                    #NewJob #SoftwareEngineering
                                </p>
                                <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                                        👍 Like
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                                        💬 Comment
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                                        🔗 Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sample Post 2 */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-start space-x-4 p-5">
                                <Avatar size="md" fallback="Jane Smith" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900">Jane Smith</h4>
                                    <p className="text-sm text-gray-600">Product Manager at StartupXYZ</p>
                                    <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                                </div>
                            </CardHeader>
                            <CardContent className="px-5 pb-5">
                                <p className="text-gray-800 mb-5 leading-relaxed">
                                    We're hiring! StartupXYZ is looking for talented Full Stack Engineers to join our growing team.
                                    If you're passionate about building products that make a difference, DM me!
                                    #Hiring #FullStack #Jobs
                                </p>
                                <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                                        👍 Like
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                                        💬 Comment
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-orange-600 hover:bg-orange-50">
                                        🔗 Share
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Empty State */}
                        <Card className="text-center py-12 bg-gradient-to-br from-orange-50/50 to-green-50/50">
                            <p className="text-gray-600 font-medium">That's all for now! Check back later for more updates.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
