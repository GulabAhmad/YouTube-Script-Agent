"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Youtube, Lock, Mail, ArrowRight } from "lucide-react";
import { SparklesCore } from "@/components/ui/aceternity/SparklesCore";
import { BackgroundGradient } from "@/components/ui/aceternity/BackgroundGradient";
import { TextReveal } from "@/components/ui/aceternity/TextReveal";
import { setUserId } from "@/store/themeConfigSlice";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/utils/auth";
import { authService } from "@/lib/api/auth";

import Link from "next/link";

export default function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const loginData = {
        email: email.toLowerCase(),
        password: password
      };

      const response = await authService.login(loginData);
      console.log("Login successful:", response);

      // Store user ID in Redux store
      dispatch(setUserId(response.user.id.toString()));
      
      // Set access token using the utility function
      setAccessToken(response.token);

      // Redirect to script analysis page
      router.push("/script-analyse");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same
  return (
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-black">
      {/* Background Effects */}
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        particleDensity={100}
        className="absolute inset-0"
        particleColor="#FFFFFF"
      />

      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="flex items-center justify-center w-16 h-16 mx-auto mb-8 border rounded-xl border-white/10 bg-black/30 backdrop-blur-sm"
        >
          <Youtube className="w-10 h-10 text-white" />
        </motion.div>

        <TextReveal
          text="Welcome Back"
          className="mb-2 text-3xl font-bold text-center text-white"
        />

        <TextReveal
          text="Sign in to continue your journey"
          className="mb-8 text-center text-white/60"
        />

        <BackgroundGradient
          className="rounded-2xl"
          gradientClassName="opacity-75"
        >
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleLogin}
            className="p-8 space-y-6 rounded-2xl bg-black/95 backdrop-blur-xl"
          >
            {error && (
              <div className="p-3 text-sm text-red-500 border rounded-lg border-red-500/20 bg-red-500/10">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-white/60" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/40" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/60" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-white/40" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Enter your password"
                />
              </div>
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-400 transition-colors hover:text-purple-300"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
              className="relative w-full group"
            >
              <div className="absolute inset-0 rounded-lg animate-gradient-xy bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-70" />
              <div className="relative rounded-lg bg-black/50 px-8 py-2.5 backdrop-blur-xl transition-all duration-200 group-hover:bg-black/40">
                <span className="relative z-10 flex items-center justify-center w-full font-medium text-white">
                  {isLoading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </motion.button>

            <p className="pt-2 text-sm text-center text-white/60">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-purple-400 transition-colors hover:text-purple-300"
              >
                Create one
              </Link>
            </p>
          </motion.form>
        </BackgroundGradient>
      </div>

      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent" />
    </div>
  );
}
