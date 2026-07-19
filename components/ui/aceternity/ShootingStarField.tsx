import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ShootingStar {
  id: number;
  top: number;
  left: number;
  speed: number;
  delay: number;
  size: number;
}

interface Props {
  starCount?: number;
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}

export const ShootingStarField: React.FC<Props> = ({
  starCount = 30,
  minSpeed = 10,
  maxSpeed = 30,
  minDelay = 1200,
  maxDelay = 4200,
  starColor = "#9E00FF",
  trailColor = "#2EB9DF",
  starWidth = 10,
  starHeight = 1,
  className = '',
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    const generateStars = () => {
      return Array.from({ length: starCount }, (_, i) => ({
        id: i,
        top: Math.random() * 50, // Keep stars in top half
        left: Math.random() * 100,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        delay: Math.random() * (maxDelay - minDelay) + minDelay,
        size: Math.random() * 2 + 1,
      }));
    };

    setStars(generateStars());
  }, [starCount, minSpeed, maxSpeed, minDelay, maxDelay]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          initial={{
            opacity: 0,
            top: `${star.top}%`,
            left: `${star.left}%`,
            x: '-100%',
            y: '-100%',
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: ['0%', '150vw'],
            y: ['0%', '150vh'],
          }}
          transition={{
            duration: star.speed,
            delay: star.delay / 1000, // Convert to seconds
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
          style={{
            position: 'absolute',
            height: `${starHeight}px`,
            width: `${starWidth}px`,
            background: `linear-gradient(90deg, ${starColor}, ${trailColor})`,
            transform: 'rotate(-45deg)',
            boxShadow: `0 0 20px ${starColor}`,
            borderRadius: '4px',
          }}
        />
      ))}
    </div>
  );
}; 