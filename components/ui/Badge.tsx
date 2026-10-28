import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "veg" | "non-veg";
  className?: string;
}

export const Badge = ({
  children,
  variant = "neutral",
  className = "",
}: BadgeProps) => {
  const variantStyles = {
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
    info: "bg-blue-50 text-blue-700 border-blue-200",
    veg: "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold",
    "non-veg": "bg-red-50 text-red-700 border-red-300 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {variant === "veg" && (
        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
      )}
      {variant === "non-veg" && (
        <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
      )}
      {children}
    </span>
  );
};
