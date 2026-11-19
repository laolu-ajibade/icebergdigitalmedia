"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  X,
} from "lucide-react";

export type ToastType = "error" | "success" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

export interface PopupAlertState {
  isOpen: boolean;
  type: ToastType;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastContextType {
  showToast: (
    type: ToastType,
    title: string,
    message: string,
    durationMs?: number
  ) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showPopup: (config: Omit<PopupAlertState, "isOpen">) => void;
  closePopup: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [popup, setPopup] = useState<PopupAlertState>({
    isOpen: false,
    type: "error",
    title: "",
    message: "",
  });
  const counterRef = useRef(0);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message: string,
      durationMs: number = 5000
    ) => {
      counterRef.current += 1;
      const id = `toast-${Date.now()}-${counterRef.current}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      if (durationMs > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, durationMs);
      }
    },
    [dismissToast]
  );

  const showError = useCallback(
    (message: string, title = "Action Failed") => {
      showToast("error", title, message, 6000);
    },
    [showToast]
  );

  const showSuccess = useCallback(
    (message: string, title = "Success") => {
      showToast("success", title, message, 4000);
    },
    [showToast]
  );

  const showPopup = useCallback((config: Omit<PopupAlertState, "isOpen">) => {
    setPopup({
      ...config,
      isOpen: true,
    });
  }, []);

  const closePopup = useCallback(() => {
    setPopup((prev) => {
      const callback = prev.onAction;
      if (callback) {
        setTimeout(callback, 0);
      }
      return { ...prev, isOpen: false, onAction: undefined };
    });
  }, []);

  return (
    <ToastContext.Provider
      value={{ showToast, showError, showSuccess, showPopup, closePopup }}
    >
      {children}

      {/* Top-Right Floating Toast Notifications */}
      {toasts.length > 0 && (
        <div
          className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
          role="region"
          aria-label="Notifications"
        >
          {toasts.map((t) => {
            const isError = t.type === "error";
            const isSuccess = t.type === "success";
            return (
              <div
                key={t.id}
                role="alert"
                className={`pointer-events-auto rounded-card border p-4 shadow-elevation bg-card flex items-start gap-3 transition-all duration-200 ${
                  isError
                    ? "border-red-300"
                    : isSuccess
                      ? "border-emerald-300"
                      : "border-amber-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isError
                      ? "bg-red-50 text-red-600"
                      : isSuccess
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {isError ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-display font-bold text-xs ${
                      isError
                        ? "text-red-700"
                        : isSuccess
                          ? "text-emerald-800"
                          : "text-amber-800"
                    }`}
                  >
                    {t.title}
                  </h4>
                  <p className="text-xs text-ink-body mt-0.5 leading-relaxed">
                    {t.message}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(t.id)}
                  className="p-1 rounded-button text-ink-muted hover:text-ink hover:bg-canvas-soft transition-colors cursor-pointer shrink-0"
                  aria-label="Dismiss notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Center Modal Error / Alert Popup */}
      {popup.isOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-card max-w-md w-full rounded-card border border-border shadow-elevation p-6 sm:p-8 text-center space-y-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                popup.type === "error"
                  ? "bg-red-50 text-red-600"
                  : popup.type === "success"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
              }`}
            >
              {popup.type === "error" ? (
                <ShieldAlert className="w-6 h-6" />
              ) : popup.type === "success" ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-black text-lg text-ink">
                {popup.title}
              </h3>
              <p className="text-xs text-ink-body leading-relaxed">
                {popup.message}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={closePopup}
                className="w-full py-2.5 px-5 min-h-[44px] rounded-button bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs transition-colors shadow-soft cursor-pointer"
              >
                {popup.actionLabel || "Dismiss"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
