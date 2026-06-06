'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "CuriousBees transformed how our department manages interdisciplinary projects. The visibility into scholar progress is unprecedented.",
      author: "Dr. Ananya Sharma",
      title: "Head of Research, Computer Science",
      initials: "AS",
      color: "bg-blue-500"
    },
    {
      quote: "Finally, a platform that understands the academic lifecycle. From finding collaborators to getting supervisor sign-offs, it just works.",
      author: "Rahul Verma",
      title: "PhD Scholar, AI & Data Science",
      initials: "RV",
      color: "bg-amber-500"
    },
    {
      quote: "The automated citation tracking and analytics dashboard saves our administration hundreds of hours every semester.",
      author: "Prof. Vikram Reddy",
      title: "Dean of Academic Affairs",
      initials: "VR",
      color: "bg-emerald-500"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Built for academia. <br /> Loved by researchers.
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Don't just take our word for it. Hear from the scholars, supervisors, and administrators driving innovation at SRMIST.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative"
            >
              <Quote className="w-8 h-8 text-primary/40 absolute top-8 right-8" />
              <p className="text-slate-300 text-lg leading-relaxed mb-8 relative z-10">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.author}</h4>
                  <p className="text-xs text-slate-400">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
