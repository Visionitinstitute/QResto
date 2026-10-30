"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onDismiss: (id: string) => void;
}

export const Toast = ({ id, type, title, message, onDismiss }: ToastProps) => {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-sky-500 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200 bg-emerald-50/80 text-emerald-950",
    error: "border-rose-200 bg-rose-50/80 text-rose-950",
    warning: "border-amber-200 bg-amber-50/80 text-amber-950",
    info: "border-sky-200 bg-sky-50/80 text-sky-950",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 shadow-md backdrop-blur-xs transition-all ${borders[type]}`}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && <p className="mt-0.5 text-xs opacity-90">{message}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="rounded-md p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

