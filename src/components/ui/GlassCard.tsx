import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "subtle";
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  variant = "default",
  hover = true,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6",
        variant === "elevated" && "shadow-lg",
        variant === "subtle" && "bg-card/50",
        !hover && "hover:transform-none hover:shadow-glass",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

export function GlassCardTitle({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <h3 className={cn("text-xl font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
}

export function GlassCardContent({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <div className={cn("text-muted-foreground", className)}>
      {children}
    </div>
  );
}
