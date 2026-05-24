"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle, MessageSquare, Play, Gamepad2, Layers, BookOpen } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HELP_SECTIONS = [
  {
    title: "Run a simulation",
    icon: Play,
    steps: [
      "Type a message in the left panel (or tap Example for sample text).",
      "Choose connection type, medium, protocol, and optional IP addresses.",
      "Tap Start simulation to watch data travel through all seven OSI layers.",
    ],
  },
  {
    title: "Toolbar controls",
    icon: MessageSquare,
    items: [
      "Medium — Ethernet, Wi-Fi, fiber, coaxial, or radio.",
      "Protocol — HTTP, HTTPS, SMTP, DNS, or FTP.",
      "Auto animate — play the simulation automatically.",
      "Auto repeat — loop the animation when it finishes.",
      "Speed — slow, normal, or fast playback.",
      "Reset — clear the current simulation state.",
      "Theme — switch the app color theme.",
    ],
  },
  {
    title: "Learn more",
    icon: BookOpen,
    items: [
      "How it works — short story walkthrough of the simulator.",
      "What is the OSI model? — detailed layer-by-layer reference.",
      "Games — quizzes and mini-games to test networking knowledge.",
    ],
  },
];

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (typeof window === "undefined") return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.35, type: "spring", stiffness: 280, damping: 28 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-xl overflow-hidden flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Help</h2>
                    <p className="text-xs text-tertiary mt-0.5">Quick guide to the simulator</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-xl border border-border bg-card hover:bg-accent transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-5">
                {HELP_SECTIONS.map((section, i) => {
                  const Icon = section.icon;
                  return (
                    <motion.section
                      key={section.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                      className="rounded-xl border border-border bg-accent/5 p-4"
                    >
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                        <Icon className="w-4 h-4 text-primary" />
                        {section.title}
                      </h3>
                      {"steps" in section && section.steps && (
                        <ol className="space-y-2 list-decimal list-inside text-sm text-foreground/90 leading-relaxed">
                          {section.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      )}
                      {"items" in section && section.items && (
                        <ul className="space-y-1.5 text-sm text-foreground/90 leading-relaxed">
                          {section.items.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.section>
                  );
                })}

                <div className="flex flex-wrap gap-3 pt-1">
                  <div className="inline-flex items-center gap-2 text-xs text-tertiary">
                    <Layers className="w-3.5 h-3.5" />
                    Right panel shows live encapsulation
                  </div>
                  <div className="inline-flex items-center gap-2 text-xs text-tertiary">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    Open Games from the menu anytime
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
