'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export default function FeedPage() {
    return (
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
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-gradient-to-r from-orange-50/50 to-green-50/50">
                        <div className="flex items-start space-x-4">
                            <Avatar size="lg" fallback="JD" />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900">John Doe</h3>
                                <p className="text-sm text-gray-600">Software Engineer at TechCorp</p>
                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-gray-800 mb-4 leading-relaxed">
                            Excited to announce that I've joined TechCorp as a Senior Software Engineer! Looking forward to working with an
                            amazing team building innovative solutions. #NewJob #SoftwareEngineering
                        </p>
                        <div className="flex items-center space-x-6 pt-4 border-t">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <span className="text-sm font-medium">Like</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-sm font-medium">Comment</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                <span className="text-sm font-medium">Share</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="border-b bg-gradient-to-r from-green-50/50 to-orange-50/50">
                        <div className="flex items-start space-x-4">
                            <Avatar size="lg" fallback="JS" />
                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-900">Jane Smith</h3>
                                <p className="text-sm text-gray-600">Product Manager at StartupXYZ</p>
                                <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-gray-800 mb-4 leading-relaxed">
                            We're hiring! StartupXYZ is looking for talented Full Stack Engineers to join our growing team. If you're passionate
                            about building products that make a difference, DM me! #Hiring #FullStack #Jobs
                        </p>
                        <div className="flex items-center space-x-6 pt-4 border-t">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <span className="text-sm font-medium">Like</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-sm font-medium">Comment</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                <span className="text-sm font-medium">Share</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-gray-500 py-4">
                    That's all for now! Check back later for more updates.
                </p>
            </div>
        </div>
    );
}
