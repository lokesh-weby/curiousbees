'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { RoleBadge } from './role-badge';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useStore();
  const router = useRouter();

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cb-focus rounded-full p-1 border border-transparent hover:border-outline-variant/30 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
          {currentUser.image ? (
            <img src={currentUser.image} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            currentUser.name?.charAt(0) ?? '?'
          )}
        </div>
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
              className="absolute right-0 top-full mt-2 w-64 bg-surface cb-card cb-glass z-50 overflow-hidden shadow-lg p-2"
            >
              <div className="px-3 py-3 border-b border-outline-variant/30 mb-1">
                <p className="text-sm font-bold text-foreground truncate">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground truncate mb-2">{currentUser.email}</p>
                <RoleBadge role={currentUser.role} size="sm" />
              </div>

              <div className="flex flex-col gap-1">
                <button
                  onClick={() => { setIsOpen(false); router.push('/profile'); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  My Profile
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push(currentUser.role === 'INSTITUTION_ADMIN' ? '/admin/settings' : '/profile');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors w-full text-left"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  Settings
                </button>
                <div className="h-px bg-outline-variant/30 my-1 w-full" />
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await logout();
                    router.push('/login');
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-left font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
