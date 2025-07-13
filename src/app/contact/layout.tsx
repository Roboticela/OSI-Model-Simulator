import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - OSI Model Simulator',
  description: 'Get in touch with the team behind the OSI Model Simulator. We\'re here to help with any questions or feedback.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 