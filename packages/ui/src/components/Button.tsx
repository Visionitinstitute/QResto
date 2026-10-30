import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "teal" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-all duration-150 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

    const variantStyles = {
      primary:
        "bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xs focus:ring-zinc-900",
      teal:
        "bg-teal-600 hover:bg-teal-700 text-white shadow-2xs focus:ring-teal-500",
      secondary:
        "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 focus:ring-zinc-400",
      outline:
        "border border-zinc-200/90 hover:border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 focus:ring-zinc-300",
      ghost:
        "bg-transparent hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 focus:ring-zinc-300",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-2xs focus:ring-red-500",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 min-h-[32px] gap-1.5",
      md: "text-sm px-4 py-2 min-h-[40px] gap-2",
      lg: "text-base px-5 py-2.5 min-h-[48px] gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

