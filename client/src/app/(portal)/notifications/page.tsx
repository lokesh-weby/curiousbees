'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Bell, Info, Mail, AlertTriangle, Calendar, Award } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, fetchNotifications, isLoading } = useStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="space-y-6 text-left select-none max-w-2xl">
      
      {/* 🚀 Header */}
      <div className="border-b border-slate-100 pb-5">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-primary animate-bounce" />
          <span>System Alerts</span>
        </span>
        <h1 className="cb-page-title mt-2 font-display">System Notifications</h1>
        <p className="cb-page-subtitle">
          Review recent notifications logged on your account.
        </p>
      </div>

      {/* 🚀 Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="cb-card p-12 text-center bg-white/95 backdrop-blur-md">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-slate-900 font-bold text-sm">All caught up!</h3>
            <p className="text-slate-400 text-xs mt-1">
              You do not have any push notifications logged in this cycle.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="cb-card p-4 bg-white/95 backdrop-blur-md flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary border border-primary/10 flex items-center justify-center shrink-0">
                <Bell className="w-4.5 h-4.5" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">
                    {notif.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 font-bold shrink-0">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {notif.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
