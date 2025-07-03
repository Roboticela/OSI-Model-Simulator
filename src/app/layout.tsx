import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "OSI Model Simulator - Interactive Network Visualization",
    template: "%s | OSI Model Simulator"
  },
  description: "An interactive visualization tool for exploring the OSI (Open Systems Interconnection) model's seven layers and understanding network communication protocols.",
  keywords: ["OSI Model", "Network Layers", "Network Simulation", "Data Transmission", "Computer Networks", "Educational Tool"],
  authors: [{ name: "Roboticela" }],
  creator: "Roboticela",
  publisher: "Roboticela",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
