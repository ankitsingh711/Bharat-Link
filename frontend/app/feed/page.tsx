'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export default function FeedPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
                {/* Create Post Card */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex space-x-3">
                            <Avatar size="md" fallback="You" />
                            <input
                                type="text"
                                placeholder="Start a post..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                                readOnly
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-4">
                    {/* Sample Post 1 */}
                    <Card>
                        <CardHeader className="flex flex-row items-start space-x-3 p-4">
                            <Avatar size="md" fallback="John Doe" />
                            <div className="flex-1">
                                <h4 className="font-semibold">John Doe</h4>
                                <p className="text-sm text-gray-500">Software Engineer at TechCorp</p>
                                <p className="text-xs text-gray-400">2 hours ago</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-gray-800 mb-4">
                                Excited to announce that I've joined TechCorp as a Senior Software Engineer!
                                Looking forward to working with an amazing team building innovative solutions.
                                #NewJob #SoftwareEngineering
                            </p>
                            <div className="flex items-center space-x-4 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                    👍 Like
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                    💬 Comment
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                    🔗 Share
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sample Post 2 */}
                    <Card>
                        <CardHeader className="flex flex-row items-start space-x-3 p-4">
                            <Avatar size="md" fallback="Jane Smith" />
                            <div className="flex-1">
                                <h4 className="font-semibold">Jane Smith</h4>
                                <p className="text-sm text-gray-500">Product Manager at StartupXYZ</p>
                                <p className="text-xs text-gray-400">5 hours ago</p>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-gray-800 mb-4">
                                We're hiring! StartupXYZ is looking for talented Full Stack Engineers to join our growing team.
                                If you're passionate about building products that make a difference, DM me!
                                #Hiring #FullStack #Jobs
                            </p>
                            <div className="flex items-center space-x-4 pt-2 border-t">
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                    👍 Like
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                    💬 Comment
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-600">
                                    🔗 Share
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Empty State */}
                    <Card className="text-center py-8">
                        <p className="text-gray-500">That's all for now! Check back later for more updates.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
