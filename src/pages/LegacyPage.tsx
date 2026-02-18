import React from "react";
import { Link } from "react-router-dom";
import OSISimulator from "../components/lagacy/OSISimulator";
import AnimatedTitle from "../components/lagacy/AnimatedTitle";
import ThemeToggle from "../components/lagacy/ThemeToggle";

export default function LegacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 font-[family-name:var(--font-geist-sans)]">
      <div className="flex-shrink-0 border-b border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/30">
        <div className="flex items-center justify-center w-full h-10 px-4">
          <Link
            to="/"
            className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-center"
          >
            Back to the main app{" "}
            <span className="underline font-medium">click here</span>
          </Link>
        </div>
      </div>
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      {/* Gradient orbs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/20 dark:bg-blue-500/10 rounded-full filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-indigo-500/20 dark:bg-indigo-500/10 rounded-full filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center mb-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Interactive Network Simulation
          </div>

          <AnimatedTitle
            title="OSI Model Simulator"
            subtitle="Experience the journey of data through all seven layers of the OSI model with our interactive, step-by-step simulation designed for learning and exploration"
          />

          <div className="mt-8 flex flex-col justify-center text-nowrap items-center gap-4">
            <div className="flex justify-center gap-3 h-full">
              <a
                href="https://en.wikipedia.org/wiki/OSI_model"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Learn about OSI
              </a>
              <ThemeToggle />
              <a
                href="https://roboticela.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
            </div>
            <a
              href="https://roboticela.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="flex md:hidden lg:hidden items-center px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </a>
          </div>
        </header>

        <main id="simulator" className="scroll-mt-8">
          <OSISimulator />
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Roboticela. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="https://roboticela.com/support" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-gray-300">Support</a>
            <a href="https://roboticela.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</a>
            <a href="https://roboticela.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</a>
            <a href="https://roboticela.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 dark:hover:text-gray-300">Contact Us</a>
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
    </div>
  );
}
