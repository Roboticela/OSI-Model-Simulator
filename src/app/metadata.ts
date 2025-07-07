import type { Metadata } from "next";

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
    ],
    apple: [
      { url: "/apple-touch-icon.svg", type: "image/svg+xml" }
    ]
  }
}; 