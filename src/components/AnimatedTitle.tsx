"use client"

import React, { useEffect, useState } from 'react';

interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function AnimatedTitle({ title, subtitle, className = '' }: AnimatedTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={`text-center ${className}`}>
      <div className="relative mb-6 inline-block">
        {/* Decorative elements */}
        <div className="absolute -left-8 -top-8 w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-lg animate-pulse-slow animation-delay-2000"></div>
        
        {/* Main title with animated letters */}
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
          {title.split('').map((char, index) => (
            <span 
              key={index} 
              className={`inline-block transition-all duration-700 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 40}ms`,
                background: isVisible ? 'linear-gradient(to right, #3b82f6, #8b5cf6)' : '',
                WebkitBackgroundClip: isVisible ? 'text' : '',
                WebkitTextFillColor: isVisible ? 'transparent' : '',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        
        {/* Animated underline */}
        <div 
          className={`h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 ${
            isVisible ? 'w-full opacity-100' : 'w-0 opacity-0'
          }`}
        ></div>
      </div>
      
      {/* Subtitle with fade-in animation */}
      {subtitle && (
        <p 
          className={`text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${title.length * 40 + 200}ms` }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
} 