import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the OSI Model Simulator - Read about the rules and guidelines for using our educational platform.",
  keywords: ["Terms of Service", "OSI Model Simulator", "Usage Policy", "Legal Terms"],
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 