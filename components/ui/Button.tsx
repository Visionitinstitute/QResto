import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
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
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none select-none";

    const variantStyles = {
      primary:
        "bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-orange-200 focus:ring-orange-500",
      secondary:
        "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 focus:ring-zinc-400",
      outline:
        "border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-50 text-zinc-800 focus:ring-orange-500",
      ghost:
        "bg-transparent hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 focus:ring-zinc-400",
      danger:
        "bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 min-h-[36px] gap-1.5",
      md: "text-sm px-4 py-2.5 min-h-[44px] gap-2", // 44px minimum touch target for mobile
      lg: "text-base px-6 py-3 min-h-[50px] gap-2.5",
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
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
