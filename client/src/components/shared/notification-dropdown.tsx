'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-muted cb-focus text-muted-foreground hover:text-foreground transition-colors"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-surface" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-surface cb-card cb-glass z-50 overflow-hidden shadow-lg flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/30">
                <h3 className="font-bold text-sm text-foreground">Notifications</h3>
                <button
                  onClick={() => setHasUnread(false)}
                  className="text-[10px] uppercase font-bold text-primary hover:text-primary/80 tracking-wider flex items-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Mark all read
                </button>
              </div>

              <div className="flex-1 max-h-[300px] overflow-y-auto">
                {hasUnread ? (
                  <div className="flex flex-col">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="flex gap-3 px-4 py-3 border-b border-outline-variant/10 hover:bg-muted/50 transition-colors cursor-pointer last:border-b-0">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0" />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-foreground leading-snug">New research thread started in your department</p>
                          <p className="text-[11px] text-muted-foreground">10 minutes ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground gap-2">
                    <Bell className="w-8 h-8 opacity-20" />
                    <p className="text-xs font-medium">No new notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
