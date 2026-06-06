'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function ToastContainer() {
  const toasts = useStore((state) => state.toasts);
  const removeToast = useStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto"
          >
            <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  };
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const { message, type } = toast;

  const styles = {
    success: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 dark:border-emerald-500/30',
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />,
      progress: 'bg-emerald-500',
    },
    error: {
      bg: 'bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/20 dark:border-rose-500/30',
      icon: <AlertCircle className="h-5 w-5 text-rose-500 dark:text-rose-400" />,
      progress: 'bg-rose-500',
    },
    info: {
      bg: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 dark:border-blue-500/30',
      icon: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
      progress: 'bg-blue-500',
    },
  }[type];

  return (
    <div className={`relative overflow-hidden flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg ${styles.bg}`}>
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
      <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed pr-6">
        {message}
      </div>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
      
      {/* Dynamic Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-[3px] ${styles.progress}`}
      />
    </div>
  );
}
