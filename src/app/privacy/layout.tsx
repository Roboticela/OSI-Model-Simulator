import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the OSI Model Simulator - Learn about how we handle your data and protect your privacy.",
  keywords: ["Privacy Policy", "OSI Model Simulator", "Data Protection", "User Privacy"],
};

export default function PrivacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 