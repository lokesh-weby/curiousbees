'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';
import CTASection from '@/components/marketing/CTASection';
import { Target, Lightbulb, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
              About CuriousBees
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
              We are on a mission to dismantle academic silos and accelerate the pace of university research through intelligent, structured collaboration.
            </p>
          </div>

          <div className="prose prose-slate prose-lg max-w-none">
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Target className="w-8 h-8 text-primary" />
              Our Mission
            </h2>
            <p className="text-slate-600 mb-12">
              CuriousBees was founded to address a critical challenge in modern academia: the fragmentation of research. Despite sharing a campus, researchers in different departments often work in isolation, unaware of the potential synergies just a building away. Our mission is to provide the digital infrastructure necessary to connect these brilliant minds, fostering interdisciplinary breakthroughs and elevating the institutional research output of SRM Institute of Science and Technology.
            </p>

            <h2 className="font-display text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-amber-500" />
              Why We Exist
            </h2>
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 mb-12">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-1 text-sm font-bold">1</div>
                  <p className="text-slate-600"><strong className="text-slate-900">For Scholars:</strong> Finding the right supervisor, discovering funding, and navigating the publication pipeline is daunting. We provide a structured roadmap and network.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1 text-sm font-bold">2</div>
                  <p className="text-slate-600"><strong className="text-slate-900">For Supervisors:</strong> Managing multiple PhD candidates across disparate email chains and folders is inefficient. We offer a unified oversight dashboard.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-1 text-sm font-bold">3</div>
                  <p className="text-slate-600"><strong className="text-slate-900">For Institutions:</strong> Tracking overall research health and enforcing governance is a manual nightmare. We automate telemetry and compliance reporting.</p>
                </li>
              </ul>
            </div>

            <h2 className="font-display text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              Platform Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Academic Integrity</h3>
                <p className="text-slate-500 text-sm">We build tools that promote original thought and enforce rigorous ethical standards in research.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Open Collaboration</h3>
                <p className="text-slate-500 text-sm">Knowledge grows when shared. We default to transparency within the institutional network.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Data Security</h3>
                <p className="text-slate-500 text-sm">Research IP is paramount. Our architecture guarantees that pre-published data remains secure.</p>
              </div>
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Continuous Innovation</h3>
                <p className="text-slate-500 text-sm">We evolve our platform to meet the cutting-edge demands of modern scientific methodologies.</p>
              </div>
            </div>
          </div>
          
        </div>
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
