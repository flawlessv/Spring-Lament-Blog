"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModernCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "glass";
  hover?: boolean;
}

export function ModernCard({
  children,
  className,
  variant = "default",
  hover = false,
}: ModernCardProps) {
  const variants = {
    default: "bg-white border border-gray-200/50 shadow-sm",
    gradient:
      "bg-gradient-to-br from-white to-gray-50 border border-gray-200/50 shadow-sm",
    glass: "bg-white/80 backdrop-blur-lg border border-white/20 shadow-lg",
  };

  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ModernCardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ModernCardHeader({
  children,
  className,
}: ModernCardHeaderProps) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-100", className)}>
      {children}
    </div>
  );
}

interface ModernCardContentProps {
  children: ReactNode;
  className?: string;
}

export function ModernCardContent({
  children,
  className,
}: ModernCardContentProps) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

interface ModernCardTitleProps {
  children: ReactNode;
  className?: string;
}

export function ModernCardTitle({ children, className }: ModernCardTitleProps) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

interface ModernCardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function ModernCardDescription({
  children,
  className,
}: ModernCardDescriptionProps) {
  return (
    <p className={cn("text-sm text-gray-600 mt-1", className)}>{children}</p>
  );
}
