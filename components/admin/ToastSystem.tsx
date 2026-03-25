"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toast, ToastVariant } from "./ui";

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Toast
              message={toast.message}
              variant={toast.variant}
              onClose={() => onDismiss(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

let _id = 0;
function genId() {
  return String(++_id);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = genId();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return { toasts, toast, dismiss };
}
