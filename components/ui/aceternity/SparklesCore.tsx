import { useEffect, useRef, useState } from "react";
import { cn } from "../../../utils/cn";

type SparkleType = {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
    zIndex: number;
  };
};

export const SparklesCore = ({
  id = "sparkles",
  className,
  background,
  minSize = 2,
  maxSize = 3,
  particleDensity = 1.5,
  particleColor = "#FFF",
  particleCount = 100,
  speed = 1.5,
  animate = true,
}: {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleColor?: string;
  particleDensity?: number;
  particleCount?: number;
  speed?: number;
  animate?: boolean;
}) => {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let interval: number;
    if (animate) {
      interval = window.setInterval(() => {
        const now = Date.now();
        setSparkles((sparkles) => {
          const newSparkles = sparkles.filter((sparkle) => {
            const delta = now - sparkle.createdAt;
            return delta < 1500; // Increased duration
          });

          if (newSparkles.length < Math.floor(particleCount * particleDensity)) {
            const sparkle = generateSparkle({
              color: particleColor,
              size: size,
              minSize,
              maxSize,
            });
            newSparkles.push(sparkle);
          }

          return newSparkles;
        });
      }, 50 / speed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [animate, particleColor, particleCount, particleDensity, size, speed, minSize, maxSize]);

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        background,
      }}
    >
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
    </div>
  );
};

const Sparkle = ({
  color,
  size,
  style,
}: {
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
    zIndex: number;
  };
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      style={style}
      className="absolute animate-sparkle"
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </svg>
  );
};

const generateSparkle = ({
  color,
  size,
  minSize,
  maxSize,
}: {
  color: string;
  size: {
    width: number;
    height: number;
  };
  minSize: number;
  maxSize: number;
}): SparkleType => {
  return {
    id: Math.random().toString(),
    createdAt: Date.now(),
    color,
    size: Math.random() * (maxSize - minSize) + minSize,
    style: {
      top: Math.random() * size.height + "px",
      left: Math.random() * size.width + "px",
      zIndex: Math.floor(Math.random() * 100),
    },
  };
}; 