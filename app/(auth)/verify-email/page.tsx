'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Brain, Mail, ArrowRight } from 'lucide-react';
import { SparklesCore } from '@/components/ui/aceternity/SparklesCore';
import { BackgroundGradient } from '@/components/ui/aceternity/BackgroundGradient';
import { TextReveal } from '@/components/ui/aceternity/TextReveal';
import Link from 'next/link';
import { authService } from '@/lib/api/auth';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);
        
        if (!code) {
            setError('Please enter the verification code');
            setIsLoading(false);
            return;
        }

        try {
            await authService.verifyEmail(email.toLowerCase(), code);
            setSuccess('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message.includes('Invalid code')) {
                    setError('Invalid verification code');
                } else if (err.message.includes('Code expired')) {
                    setError('Verification code has expired. Please request a new one.');
                } else {
                    setError(err.message || 'Unable to verify email. Please try again.');
                }
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-4">
            <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="absolute inset-0"
                particleColor="#FFFFFF"
            />

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                    }}
                    className="w-16 h-16 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/10"
                >
                    <Brain className="w-10 h-10 text-white" />
                </motion.div>

                <TextReveal
                    text="Verify Your Email"
                    className="text-white text-3xl font-bold text-center mb-2"
                />
                
                <TextReveal
                    text="Enter the verification code sent to your email"
                    className="text-white/60 text-center mb-8"
                />

                <BackgroundGradient className="rounded-2xl" gradientClassName="opacity-75">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleVerify}
                        className="p-8 rounded-2xl bg-black/95 backdrop-blur-xl space-y-6"
                    >
                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
                                {success}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-white/60 text-sm" htmlFor="code">Verification Code</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-10 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    placeholder="Enter verification code"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isLoading}
                            className="w-full relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg animate-gradient-xy opacity-70" />
                            <div className="relative px-8 py-2.5 rounded-lg bg-black/50 backdrop-blur-xl transition-all duration-200 group-hover:bg-black/40">
                                <span className="relative z-10 flex items-center justify-center w-full text-white font-medium">
                                    {isLoading ? 'Verifying...' : 'Verify Email'}
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </motion.button>
                        
                        <p className="text-center text-white/60 text-sm pt-2">
                            Already verified?{' '}
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </motion.form>
                </BackgroundGradient>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent" />
        </div>
    );
} 