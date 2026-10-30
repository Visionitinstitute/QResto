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
    default: "bg-white border border-zinc-200/80 shadow-2xs",
    flat: "bg-zinc-50/70 border border-zinc-200/70",
    interactive:
      "bg-white border border-zinc-200/80 shadow-2xs hover:shadow-xs hover:border-teal-300 transition-all duration-150 cursor-pointer",
  };

  return (
    <div
      className={`rounded-xl ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-4 sm:p-5 border-b border-zinc-100 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={`text-base font-semibold text-zinc-900 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={`text-xs text-zinc-500 mt-0.5 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-4 sm:p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-4 sm:p-5 border-t border-zinc-100 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
