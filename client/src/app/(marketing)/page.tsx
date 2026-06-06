'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import HeroSection from '@/components/marketing/HeroSection';
import FeatureCards from '@/components/marketing/FeatureCards';
import WorkflowSection from '@/components/marketing/WorkflowSection';
import ResearchStats from '@/components/marketing/ResearchStats';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import FAQSection from '@/components/marketing/FAQSection';
import CTASection from '@/components/marketing/CTASection';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function MarketingPage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      
      <MarketingNavbar />

      <main className="flex-grow w-full flex flex-col">
        <HeroSection />
        <FeatureCards />
        <WorkflowSection />
        <ResearchStats />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>

      <MarketingFooter />

    </div>
  );
}
