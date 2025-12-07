'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { authApi } from '@/lib/api/endpoints/auth';
import { showToast } from '@/lib/utils/toast';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!email) {
                throw new Error('Email not found');
            }

            await authApi.verify(email, code);
            setSuccess(true);
            showToast.success('Email verified successfully!');

            // Show success message briefly, then redirect to feed (home page)
            setTimeout(() => {
                router.push('/feed');
            }, 2000);
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Invalid verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);

        try {
            if (!email) {
                throw new Error('Email not found');
            }

            // Call resend verification code API
            await authApi.resendVerificationCode(email);
            showToast.success('Verification code sent! Check your email.');
        } catch (err: any) {
            showToast.error(err.response?.data?.message || 'Failed to resend code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100/50 to-green-50 px-4">
                <Card className="w-full max-w-md animate-slide-up">
                    <CardContent className="p-10 text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="h-20 w-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Email Verified!</h2>
                        <p className="text-gray-600 mb-4 text-base">Your email has been successfully verified.</p>
                        <p className="text-sm text-gray-500">Taking you to your home feed...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100/50 to-green-50 px-4">
            <Card className="w-full max-w-md animate-slide-up">
                <CardHeader className="space-y-3 text-center">
                    <div className="flex justify-center mb-2">
                        <Logo size="md" variant="icon" />
                    </div>
                    <CardTitle className="text-3xl">Verify Your Email</CardTitle>
                    <CardDescription className="text-base">
                        We've sent a verification code to<br />
                        <strong className="text-gray-900">{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {searchParams.get('from') === 'login' && (
                        <div className="mb-5 p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                            <p className="text-sm text-blue-800">
                                <strong>Account not verified yet.</strong> Please enter the verification code sent to your email to complete your registration.
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-5">
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
                            helperText="Check your email for the 6-digit code"
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                            disabled={isLoading || code.length !== 6}
                        >
                            Verify Email
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={isLoading}
                                className="text-orange-600 hover:text-orange-700 hover:underline font-semibold disabled:opacity-50 transition-colors"
                            >
                                Resend Code
                            </button>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                            Check your spam folder if you don't see the email
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
