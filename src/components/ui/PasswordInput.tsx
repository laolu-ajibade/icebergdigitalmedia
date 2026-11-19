"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  toggleLabel?: string;
}

/**
 * Password input with an inline show/hide visibility toggle button.
 */
export function PasswordInput({
  className = "",
  toggleLabel = "password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full px-3 py-2 pr-11 min-h-[44px] bg-canvas-soft border border-border rounded-button text-ink ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? `Hide ${toggleLabel}` : `Show ${toggleLabel}`}
        className="absolute right-1 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-ink-muted hover:text-ink transition-colors cursor-pointer"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
