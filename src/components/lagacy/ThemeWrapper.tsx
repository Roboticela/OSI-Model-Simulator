"use client";

import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function ThemeWrapper() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
  );
} 