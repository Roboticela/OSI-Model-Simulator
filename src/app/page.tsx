"use client"

import React from "react";
import OSISimulator from "../components/OSISimulator";
import AnimatedTitle from "../components/AnimatedTitle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 font-[family-name:var(--font-geist-sans)]">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-purple-500/20 dark:bg-purple-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            Interactive Network Simulation
          </div>
          
          <AnimatedTitle 
            title="OSI Model Simulator" 
            subtitle="Experience the journey of data through all seven layers of the OSI model with our interactive, step-by-step simulation designed for learning and exploration"
          />
          
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a 
              href="https://en.wikipedia.org/wiki/OSI_model" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Learn about OSI
            </a>
            <a 
              href="#simulator" 
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors btn-hover-effect"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Start Simulation
            </a>
          </div>
        </header>
        
        <main id="simulator" className="scroll-mt-8">
          <OSISimulator />
        </main>
        
        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} OSI Model Simulator. All rights reserved.</p>
          <p className="mt-1">A project by Roboticela</p>
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
