'use client';
import { motion } from 'framer-motion';
import { Youtube, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { SparklesCore } from '../ui/aceternity/SparklesCore';
import { BackgroundGradient } from '../ui/aceternity/BackgroundGradient';
import { TextReveal } from '../ui/aceternity/TextReveal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/auth';
import { BASE_URL } from '@/lib/utils';

const ComponentsAuthRegisterForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters long';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const registerData = {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email.toLowerCase(),
                password: formData.password
            };

            const response = await authService.register(registerData);
            console.log('Registration successful:', response);

            // Redirect to verification page
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-black">
            <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="absolute inset-0"
                particleColor="#FFFFFF"
            />

            <div className="relative z-10 w-full max-w-md">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                    }}
                    className="flex items-center justify-center w-16 h-16 mx-auto mb-8 rounded-xl bg-white/10 backdrop-blur-sm"
                >
                    <Youtube className="w-10 h-10 text-white" />
                </motion.div>

                <TextReveal
                    text="Create Your Account"
                    className="mb-2 text-3xl font-bold text-center text-white"
                />
                
                <TextReveal
                    text="Enter Your Data"
                    className="mb-8 text-center text-white/60"
                />

                <BackgroundGradient className="rounded-[22px]" gradientClassName="opacity-20">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        onSubmit={handleRegister}
                        className="p-8 rounded-[20px] bg-black/80 backdrop-blur-xl space-y-6"
                    >
                        {error && (
                            <div className="p-3 text-sm text-red-500 border rounded-lg bg-red-500/10 border-red-500/20">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">First Name</label>
                                <div className="relative">
                                    <User className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={`w-full bg-white/5 border ${fieldErrors.firstName ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-10 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/20`}
                                        placeholder="John"
                                    />
                                </div>
                                {fieldErrors.firstName && (
                                    <p className="text-xs text-red-500">{fieldErrors.firstName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Last Name</label>
                                <div className="relative">
                                    <User className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={`w-full bg-white/5 border ${fieldErrors.lastName ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-10 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/20`}
                                        placeholder="Doe"
                                    />
                                </div>
                                {fieldErrors.lastName && (
                                    <p className="text-xs text-red-500">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/60">Email</label>
                            <div className="relative">
                                <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/40" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full bg-white/5 border ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-10 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/20`}
                                    placeholder="john@company.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="text-xs text-red-500">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-white/60">Password</label>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/40" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full bg-white/5 border ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-10 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/20`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500">{fieldErrors.password}</p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className="relative inline-flex items-center justify-center w-full px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-lg group bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary"
                            type="submit"
                        >
                            <span className="relative z-10 flex items-center justify-center w-full">
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 transition-opacity opacity-0 bg-white/20 backdrop-blur-xl group-hover:opacity-20" />
                        </motion.button>

                        <p className="text-sm text-center text-white/60">
                            Already have an account?{' '}
                            <Link href="/login" className="transition-colors text-primary hover:text-primary-light">
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
};

export default ComponentsAuthRegisterForm;
