'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
  const faqs = [
    {
      q: "Who can join the CuriousBees platform?",
      a: "CuriousBees is currently exclusive to SRM Institute of Science and Technology. Active Research Scholars, PhD Candidates, Faculty Supervisors, and Institutional Administrators with a valid university email can access the platform."
    },
    {
      q: "How does the role verification process work?",
      a: "When you sign in using your university Google account, the system automatically detects your institutional role. Scholars may require a one-time verification step by their assigned Research Supervisor before gaining full access to project workspaces."
    },
    {
      q: "Is my research data secure?",
      a: "Yes. CuriousBees employs enterprise-grade encryption and strict access controls. Research artifacts and database nodes are protected within the university's secure intranet framework, ensuring academic integrity and data privacy."
    },
    {
      q: "Can I collaborate with researchers from other departments?",
      a: "Absolutely! Our Semantic Research Discovery engine is built to break down departmental silos. You can find and connect with peers across all faculties based on shared research interests and methodologies."
    },
    {
      q: "How do supervisors track scholar progress?",
      a: "Supervisors have a dedicated management dashboard that provides real-time visibility into their scholars' milestones, draft submissions, and pending approvals, streamlining the entire mentorship pipeline."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 md:py-32 bg-white relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-lg">
            Everything you need to know about the CuriousBees platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border rounded-2xl overflow-hidden transition-colors ${openIndex === idx ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${openIndex === idx ? 'rotate-180 text-primary' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
