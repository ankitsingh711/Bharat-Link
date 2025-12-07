'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { showToast } from '@/lib/utils/toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post(`${API_URL}/auth/forgot-password`, { email });
            showToast.success('Password reset code sent! Check your email.');
            // Redirect to reset password page with email
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100/50 to-green-50 px-4">
            <Card className="w-full max-w-md animate-slide-up">
                <CardHeader className="space-y-3 text-center">
                    <div className="flex justify-center mb-2">
                        <Logo size="md" variant="icon" />
                    </div>
                    <CardTitle className="text-3xl">Forgot Password?</CardTitle>
                    <CardDescription className="text-base">
                        Enter your email and we'll send you a code to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Send Reset Code
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link href="/login" className="text-orange-600 hover:text-orange-700 hover:underline font-semibold transition-colors">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
