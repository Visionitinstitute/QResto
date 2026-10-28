import React, { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "interactive";
}

export const Card = ({
  children,
  className = "",
  variant = "default",
  ...props
}: CardProps) => {
  const variantStyles = {
    default: "bg-white border border-zinc-200 shadow-sm",
    flat: "bg-zinc-50 border border-zinc-200/80",
    interactive:
      "bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer",
  };

  return (
    <div
      className={`rounded-2xl p-5 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
