'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Activity, Users, BookOpen, LineChart, FileText } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Intro Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          CuriousBees 2.0 is now available
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mb-6 leading-tight"
        >
          Elevate Your Academic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
            Research Ecosystem.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed"
        >
          A university-grade platform designed for scholars, supervisors, and institutions to collaborate, track progress, and discover opportunities with unprecedented clarity.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20"
        >
          <Link href="/login">
            <button className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 px-8 py-3.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group">
              Start Collaborating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/about">
            <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-3.5 rounded-full text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2 group">
              Learn More
            </button>
          </Link>
        </motion.div>

        {/* Sleek App Interface Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-2 shadow-2xl relative overflow-hidden ring-1 ring-slate-900/5"
        >
          {/* Top Bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-white/80 rounded-t-xl">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="bg-slate-100/50 px-32 py-1 rounded-md text-[10px] text-slate-400 font-medium">
                research.curiousbees.edu
              </div>
            </div>
          </div>
          
          {/* Mockup Body */}
          <div className="bg-slate-50/50 rounded-b-xl p-6 min-h-[360px] grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3 border-r border-slate-100 pr-4 hidden md:block">
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded w-20 mb-6" />
                {[
                  { icon: FileText, label: 'Projects' },
                  { icon: Users, label: 'Supervisors' },
                  { icon: Activity, label: 'Analytics' },
                  { icon: BookOpen, label: 'Publications' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="col-span-12 md:col-span-9 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-6 bg-slate-800 rounded w-48 mb-2" />
                  <div className="h-4 bg-slate-400 rounded w-32" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Active Drafts', val: '12', trend: '+2 this week' },
                  { label: 'Citations', val: '3,492', trend: '+14% MoM' },
                  { label: 'Collaborators', val: '8', trend: 'across 3 depts' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                    <p className="text-xs font-medium text-slate-500 mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{stat.val}</p>
                    <p className="text-[10px] text-green-600 font-medium">{stat.trend}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm flex-1">
                <div className="h-4 bg-slate-200 rounded w-32 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="h-3 bg-slate-300 rounded w-40 mb-1.5" />
                          <div className="h-2 bg-slate-200 rounded w-24" />
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-blue-50 rounded-full border border-blue-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
