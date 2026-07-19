"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { SparklesCore } from '../ui/aceternity/SparklesCore';
import { Youtube, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ShootingStarField } from '../ui/aceternity/ShootingStarField';
import { TextReveal } from '../ui/aceternity/TextReveal';
export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
      {/* Static Stars Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_100%)]" />
      </div>

      {/* Shooting Stars Background */}
      <ShootingStarField 
        starCount={30} 
        minSpeed={8}
        maxSpeed={15}
        className="absolute inset-0"
      />
      
      {/* Sparkles Effect */}
      <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={2}
        maxSize={3}
        particleDensity={1.5}
        className="absolute inset-0"
        particleColor="#FFFFFF"
        speed={1.5}
        particleCount={100}
      />

      {/* Content */}
      <div className="relative z-10 px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="flex items-center justify-center w-16 h-16 mx-auto mb-8 rounded-xl bg-white/10 backdrop-blur-sm"
        >
          <Youtube className="w-10 h-10 text-white" />
        </motion.div>

        {/* Headings */}
        <div className="mb-12 space-y-4">
          <TextReveal
            text="Welcome"
            className="text-xl font-light tracking-widest uppercase text-white/50"
          />
          <h1 className="text-4xl font-bold text-transparent md:text-6xl lg:text-7xl bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
            Youtube Script
          </h1>
          {/* <TextReveal
            text="Master your pitch with real-time AI coaching"
            className="mt-4 text-xl font-light text-white/70 md:text-2xl"
          /> */}
        </div>

        {/* CTA Button */}
        <motion.button
          onClick={() => router.push('/login')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all duration-300 rounded-full group bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10 flex items-center">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 transition-opacity opacity-0 bg-white/20 backdrop-blur-xl group-hover:opacity-20" />
        </motion.button>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent opacity-80" />
    </div>
  );
}