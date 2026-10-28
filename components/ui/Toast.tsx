import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastProps {
  type?: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

export const Toast = ({ type = "info", message, onClose }: ToastProps) => {
  const typeStyles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    error: "bg-red-50 border-red-200 text-red-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm w-full transition-all animate-slide-up ${typeStyles[type]}`}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 transition-colors p-1"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
