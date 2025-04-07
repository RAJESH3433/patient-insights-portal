
import React from "react";
import { cn } from "@/lib/utils";

type RiskLevel = "high" | "medium" | "low";

interface RiskLevelBadgeProps {
  level: RiskLevel;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const RiskLevelBadge = ({ 
  level, 
  className, 
  showLabel = true,
  size = "md" 
}: RiskLevelBadgeProps) => {
  const baseClasses = "rounded-full flex items-center justify-center font-medium";
  
  const sizeClasses = {
    sm: showLabel ? "text-xs px-2 py-0.5" : "w-2 h-2",
    md: showLabel ? "text-sm px-3 py-1" : "w-3 h-3",
    lg: showLabel ? "text-base px-4 py-1.5" : "w-4 h-4"
  };
  
  const colorClasses = {
    high: "bg-risk-high text-white",
    medium: "bg-risk-medium text-gray-800",
    low: "bg-risk-low text-white"
  };

  const labels = {
    high: "High Risk",
    medium: "Medium Risk",
    low: "Low Risk"
  };

  return (
    <div 
      className={cn(
        baseClasses, 
        sizeClasses[size], 
        colorClasses[level],
        className
      )}
    >
      {showLabel ? labels[level] : null}
    </div>
  );
};

export default RiskLevelBadge;
