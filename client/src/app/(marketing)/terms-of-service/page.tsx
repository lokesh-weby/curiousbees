'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function TermsOfServicePage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Terms of Service
            </h1>
            <p className="text-slate-500">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead text-xl text-slate-600 mb-8">
              Welcome to CuriousBees. By accessing or using our platform, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of the platform within the context of SRM Institute of Science and Technology.
            </p>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">1. Acceptance of Terms</h2>
            <p>By logging into CuriousBees using your institutional credentials, you confirm that you are an authorized user (Scholar, Supervisor, or Administrator) and agree to abide by these terms and all applicable university policies.</p>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">2. User Responsibilities & Academic Integrity</h2>
            <p>You are responsible for all activities occurring under your account. You agree to:</p>
            <ul>
              <li>Maintain the confidentiality of your authentication credentials.</li>
              <li>Uphold the highest standards of academic integrity. Plagiarism, data fabrication, and intellectual property theft are strictly prohibited.</li>
              <li>Use the platform solely for legitimate academic research and collaboration.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">3. Acceptable Use</h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Upload malicious code or attempt to compromise the platform's security.</li>
              <li>Share confidential or pre-published research data outside of authorized workspaces without explicit permission.</li>
              <li>Harass, abuse, or harm other users of the platform.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">4. Intellectual Property</h2>
            <p>All research artifacts uploaded to the platform remain the intellectual property of the respective authors and/or the university, in accordance with SRMIST intellectual property guidelines. CuriousBees claims no ownership over your research data.</p>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">5. Platform Modification & Termination</h2>
            <p>We reserve the right to modify, suspend, or discontinue any part of the platform at any time. Accounts found in violation of these terms or university policies may be suspended or terminated without prior notice.</p>
          </div>
          
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
