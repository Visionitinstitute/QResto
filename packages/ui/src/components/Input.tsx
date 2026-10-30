import React, { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-zinc-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full rounded-xl border px-3 py-2 text-sm transition-colors duration-150
            bg-white text-zinc-900 placeholder:text-zinc-400
            focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600
            ${
              error
                ? "border-red-500 focus:ring-red-400/20 focus:border-red-500"
                : "border-zinc-200/90 hover:border-zinc-300"
            }
            ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && (
          <p className="text-[11px] text-zinc-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

