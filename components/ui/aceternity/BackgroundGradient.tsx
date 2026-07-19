import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
  gradientClassName?: string;
}

export const BackgroundGradient = ({
  children,
  className,
  gradientClassName,
}: BackgroundGradientProps) => {
  return (
    <div className={cn('relative p-[1px] overflow-hidden', className)}>
      {/* Animated gradient border */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
          'animate-gradient-xy',
          gradientClassName
        )}
      />
      
      {/* Inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 