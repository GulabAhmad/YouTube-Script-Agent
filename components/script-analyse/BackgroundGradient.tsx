import React from 'react';

interface BackgroundGradientProps {
  className?: string;
  animate?: boolean;
  gradientClassName?: string;
  children: React.ReactNode;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  className = '',
  animate = false,
  gradientClassName = '',
  children
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-opacity duration-500 ${gradientClassName}`}
        style={{
          filter: 'blur(24px)',
          transform: 'translate(-1px, -1px)',
        }}
      />
      {children}
    </div>
  );
};

export default BackgroundGradient; 