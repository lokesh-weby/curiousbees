'use client';

import React from 'react';
import MarketingNavbar from '@/components/marketing/MarketingNavbar';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white text-slate-900 font-sans antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <MarketingNavbar />
      
      <main className="flex-grow w-full pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
              Privacy Policy
            </h1>
            <p className="text-slate-500">Effective Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead text-xl text-slate-600 mb-8">
              CuriousBees ("we," "our," or "the Platform") is committed to protecting the privacy and security of our users' personal and academic data. This Privacy Policy outlines how we collect, use, and safeguard information within the SRM Institute of Science and Technology research ecosystem.
            </p>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">1. Data Collection</h2>
            <p>We collect information to provide a secure and efficient collaboration environment. This includes:</p>
            <ul>
              <li><strong>Authentication Data:</strong> University email addresses, names, and profile pictures retrieved via Google OAuth.</li>
              <li><strong>Academic Data:</strong> Department affiliations, roles (e.g., Scholar, Supervisor), and publication records voluntarily submitted.</li>
              <li><strong>Research Artifacts:</strong> Drafts, comments, and project data uploaded to secure workspaces.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">2. How We Use Your Data</h2>
            <p>Your data is used strictly for academic and administrative purposes:</p>
            <ul>
              <li>To facilitate secure login and role-based access control.</li>
              <li>To connect you with relevant researchers via Semantic Discovery.</li>
              <li>To generate institutional analytics (aggregated and anonymized) for university administration.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">3. Data Sharing & Security</h2>
            <p>Research data is highly sensitive. We implement strict security measures:</p>
            <ul>
              <li>We do <strong>not</strong> sell your data to third parties.</li>
              <li>Project data is restricted to authorized workspace members and institutional oversight committees.</li>
              <li>All data is encrypted in transit and at rest using enterprise-grade standards.</li>
            </ul>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">4. User Rights & Data Retention</h2>
            <p>As a user, you have the right to request access to, correction of, or deletion of your personal data, subject to university data retention policies for academic records. Research artifacts are retained in accordance with SRMIST archival requirements.</p>

            <h2 className="font-display text-2xl font-bold text-slate-900 mt-12 mb-4">5. Contact Us</h2>
            <p>For any privacy-related inquiries or to exercise your rights, please contact the university data protection officer or reach out to us via our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </div>
          
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
