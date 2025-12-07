'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Logo } from '@/components/ui/Logo';
import { showToast } from '@/lib/utils/toast';

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.password !== formData.confirmPassword) {
            showToast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            showToast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const { confirmPassword, ...signupData } = formData;
            await signup(signupData);
            showToast.success('Account created! Please verify your email.');
            // Redirect to verification page with email in query params
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            // Check if error is "User is not confirmed" - this is actually success!
            if (err.response?.data?.message?.includes('not confirmed')) {
                showToast.success('Account created! Please verify your email.');
                // User was created but needs verification
                router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
                return;
            }
            showToast.error(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-orange-100/50 to-green-50 px-4 py-12">
            <Card className="w-full max-w-md animate-slide-up">
                <CardHeader className="space-y-3 text-center">
                    <div className="flex justify-center mb-2">
                        <Logo size="md" variant="icon" />
                    </div>
                    <CardTitle className="text-3xl">Create Account</CardTitle>
                    <CardDescription className="text-base">
                        Join Bharat Link and start networking
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled={isLoading}
                            helperText="Optional"
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            className="w-full cursor-pointer"
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-orange-600 hover:text-orange-700 hover:underline font-semibold transition-colors cursor-pointer">
                            Sign in
                        </Link>
                    </div>

                    <p className="mt-6 text-xs text-center text-gray-500 leading-relaxed">
                        By creating an account, you agree to our{' '}
                        <Link href="/terms" className="text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                            Privacy Policy
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
