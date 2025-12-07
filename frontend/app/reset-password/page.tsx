'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { showToast } from '@/lib/utils/toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
            showToast.error('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            showToast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(`${API_URL}/auth/reset-password`, {
                email,
                code,
                newPassword: password,
            });
            showToast.success('Password reset successful! You can now log in.');
            router.push('/login');
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Failed to reset password. Please check your code.');
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
                    <CardTitle className="text-3xl">Reset Password</CardTitle>
                    <CardDescription className="text-base">
                        Enter the code sent to <strong className="text-gray-900">{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Verification Code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            disabled={isLoading}
                            maxLength={6}
                            pattern="[0-9]{6}"
                            helperText="Check your email for the code"
                        />

                        <Input
                            label="New Password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={isLoading || code.length !== 6}
                        >
                            Reset Password
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
