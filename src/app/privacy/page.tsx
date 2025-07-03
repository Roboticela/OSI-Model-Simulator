"use client"

import React from "react";
import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 font-[family-name:var(--font-geist-sans)]">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex justify-center mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
              <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              Legal Information
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </header>
        
        <main className="prose dark:prose-invert prose-blue max-w-3xl mx-auto">
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Introduction</h2>
            <p>
              At OSI Model Simulator, we respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Information We Collect</h2>
            <p>
              Our website is primarily an educational tool and does not require users to create accounts or provide personal information.
              We may collect anonymous usage data to improve our service, such as:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Technical data including browser type, operating system, and device information</li>
              <li>Usage data such as pages visited and time spent on the website</li>
            </ul>
          </section>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Improve and optimize our website</li>
              <li>Understand how users interact with our simulator</li>
              <li>Fix bugs and address technical issues</li>
            </ul>
          </section>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Cookies and Tracking Technologies</h2>
            <p>
              We may use cookies and similar tracking technologies to track activity on our website and hold certain information.
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, 
              or destruction of your personal information.
            </p>
          </section>
          
          <section className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
        </main>
        
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Roboticela. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">Home</Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</Link>
          </div>
          <p className="mt-2">
            <a 
              href="https://github.com/Roboticela/OSI-Model-Simulator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Open Source on GitHub
            </a>
          </p>
        </footer>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-pattern {
          background-size: 100px 100px;
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        }
        .dark .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
