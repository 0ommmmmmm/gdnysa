import { useEffect, useState, useRef, ReactNode } from "react";

interface ParallaxBackgroundProps {
  children?: ReactNode;
  className?: string;
}

export function ParallaxBackground({ children, className = "" }: ParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Layer 1 - Slowest (deepest) */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`,
          willChange: "transform",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="geo-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(75 35% 35% / 0.1)" />
              <stop offset="100%" stopColor="hsl(35 30% 60% / 0.1)" />
            </linearGradient>
          </defs>
          <path
            d="M0,400 Q480,350 960,400 T1920,350 L1920,1080 L0,1080 Z"
            fill="url(#geo-gradient-1)"
          />
        </svg>
      </div>

      {/* Layer 2 - Medium speed */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`,
          willChange: "transform",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="geo-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(200 10% 50% / 0.15)" />
              <stop offset="100%" stopColor="hsl(25 40% 30% / 0.1)" />
            </linearGradient>
          </defs>
          <path
            d="M0,500 Q320,450 640,500 T1280,450 T1920,500 L1920,1080 L0,1080 Z"
            fill="url(#geo-gradient-2)"
          />
        </svg>
      </div>

      {/* Layer 3 - Faster (closest) */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          willChange: "transform",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="geo-gradient-3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(30 15% 15% / 0.1)" />
              <stop offset="100%" stopColor="hsl(35 30% 75% / 0.1)" />
            </linearGradient>
          </defs>
          <path
            d="M0,600 Q240,550 480,600 T960,550 T1440,600 T1920,550 L1920,1080 L0,1080 Z"
            fill="url(#geo-gradient-3)"
          />
        </svg>
      </div>

      {/* Contour lines decoration */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`,
          willChange: "transform",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <g stroke="hsl(75 35% 35% / 0.3)" strokeWidth="1" fill="none">
            <path d="M0,200 Q480,180 960,220 T1920,180" />
            <path d="M0,250 Q480,230 960,270 T1920,230" />
            <path d="M0,300 Q480,280 960,320 T1920,280" />
            <path d="M0,700 Q480,680 960,720 T1920,680" />
            <path d="M0,750 Q480,730 960,770 T1920,730" />
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface FloatingElementProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "accent" | "secondary";
  delay?: number;
}

export function FloatingElement({ 
  className = "", 
  size = "md",
  color = "primary",
  delay = 0
}: FloatingElementProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const colorClasses = {
    primary: "bg-primary/10",
    accent: "bg-accent/10",
    secondary: "bg-secondary/30",
  };

  return (
    <div
      className={`rounded-full blur-2xl animate-float ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
}
