"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Wifi, Globe, Play, Layers, ArrowDown, ArrowUp } from "lucide-react";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { icon: MessageSquare, label: "Enter a message", detail: "Type what you want to “send” (e.g. Hello, World!)." },
  { icon: Wifi, label: "Choose medium & protocol", detail: "Pick transmission medium (Ethernet, Wi‑Fi, etc.) and protocol (HTTPS, SMTP, DNS…) in the header." },
  { icon: Globe, label: "Set addresses (optional)", detail: "Source and destination IPs—or leave defaults." },
  { icon: Play, label: "Start simulation", detail: "Click Start simulation. Use Auto, Repeat, and Speed to control the flow." },
];

export default function StoryModal({ isOpen, onClose }: StoryModalProps) {
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
              className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl shadow-black/10 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border/80 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                    className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                  >
                    <Layers className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                      How it works
                    </h2>
                    <p className="text-xs text-tertiary mt-0.5">OSI Model Simulator</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-xl border border-border bg-card/80 hover:bg-accent hover:border-primary/40 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-xl bg-muted/40 border border-border/60 p-4"
                  >
                    <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">
                      The <strong className="text-foreground">OSI model</strong> describes how data travels over a network in seven layers. Each layer adds or strips control information as the message passes through—<strong className="text-foreground">encapsulation</strong> on the way down, <strong className="text-foreground">decapsulation</strong> on the way back up.
                    </p>
                  </motion.div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      Using the simulator
                    </h3>
                    <ul className="space-y-2">
                      {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        return (
                          <motion.li
                            key={step.label}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.06 }}
                            className="flex gap-3 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-accent/30 hover:border-primary/20 transition-colors"
                          >
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {i + 1}
                            </span>
                            <div className="flex gap-3 min-w-0 flex-1">
                              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground text-sm">{step.label}</p>
                                <p className="text-xs text-tertiary mt-0.5 leading-relaxed">{step.detail}</p>
                              </div>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2">
                      <ArrowDown className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Encapsulation</p>
                        <p className="text-xs text-tertiary mt-0.5">Sender: each layer adds its header (Application → Physical).</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2">
                      <ArrowUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-foreground">Decapsulation</p>
                        <p className="text-xs text-tertiary mt-0.5">Receiver: each layer strips its header (Physical → Application).</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="text-xs text-tertiary leading-relaxed"
                  >
                    You can change the message, medium, or protocol anytime and start a new simulation—no need to reset.
                  </motion.p>
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
