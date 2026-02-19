"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSISimulator } from "../contexts/OSISimulatorContext";
import { OSI_LAYERS, type SimulationPhase } from "../types/osi";
import { formatHexForDisplay } from "../lib/osiSimulation";
import { cn } from "../lib/utils";
import {
  ArrowDown,
  ArrowUp,
  MousePointer,
  Send,
  Layers,
  Handshake,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Server,
  Globe,
  Palette,
  MessageCircle,
  Package,
  Network,
  Link,
  Radio,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SignalVisualization from "./SignalVisualization";

/** Scroll speed in pixels per second (duration is then derived from actual scroll height) */
const SCROLL_PX_PER_SEC: Record<string, number> = {
  slow: 10,
  normal: 20 ,
  fast: 40,
};
/** Min/max duration per speed so very short or very tall content still feels right */
const SCROLL_DURATION_MIN_MS: Record<string, number> = {
  slow: 4000,
  normal: 3000,
  fast: 2000,
};
const SCROLL_DURATION_MAX_MS: Record<string, number> = {
  slow: 15000,
  normal: 12000,
  fast: 8000,
};

/** Pixels to scroll per Up/Down arrow key press */
const KEYBOARD_SCROLL_STEP_PX = 100;

const HANDSHAKE_STEPS = [
  { label: "SYN", desc: "Client sends SYN (synchronize) to initiate the connection.", direction: "client-to-server" as const },
  { label: "SYN-ACK", desc: "Server responds with SYN-ACK (synchronize-acknowledge).", direction: "server-to-client" as const },
  { label: "ACK", desc: "Client sends ACK (acknowledge). Connection established.", direction: "client-to-server" as const },
];

const REALTIME_STEPS = [
  { label: "Data", desc: "Sender transmits data immediately — no connection setup.", direction: "client-to-server" as const },
  { label: "Data", desc: "Receiver gets the data directly. No handshake required.", direction: "server-to-client" as const },
  { label: "Flow", desc: "Connection is active; data can flow both ways at any time.", direction: "bidirectional" as const },
];

const LAYER_ICONS: Record<number, LucideIcon> = {
  7: Globe,
  6: Palette,
  5: MessageCircle,
  4: Package,
  3: Network,
  2: Link,
  1: Radio,
};

function getDecapsulationDescription(layerNumber: number, pduName: string): string {
  const upper = layerNumber === 7 ? "application" : `Layer ${layerNumber + 1}`;
  return `Stripped ${pduName} header; validated and passed payload to ${upper}.`;
}

export default function OSIVisualization() {
  const { config, currentStep, phase, handshakeStep, goToStep, goToHandshake, encapsulation, advanceHandshake, goBackHandshake, startReceiving } = useOSISimulator();
  const isHandshakeConnection = config.connectionType === "handshake";
  const isHandshake = phase === "handshake";
  const isSending = phase === "sending";
  const isReceiving = phase === "receiving";
  const isComplete = phase === "complete";
  const isActive = isHandshake || isSending || isReceiving || isComplete;
  const autoAnimate = config.autoAnimate ?? false;
  const autoRepeat = config.autoRepeat ?? false;
  const prevPhaseRef = useRef<SimulationPhase>("idle");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showDirectConnectionInfo, setShowDirectConnectionInfo] = useState(false);

  // Start simulation from Realtime card (direct) or Handshake (handshake), not from Application layer
  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;
    if (prev === "idle" && phase === "sending" && !isHandshakeConnection) {
      setShowDirectConnectionInfo(true);
    }
  }, [phase, isHandshakeConnection]);

  const scrollPxPerSec = SCROLL_PX_PER_SEC[config.speed] ?? 90;
  const scrollMinMs = SCROLL_DURATION_MIN_MS[config.speed] ?? 3000;
  const scrollMaxMs = SCROLL_DURATION_MAX_MS[config.speed] ?? 12000;
  // Sending: step 1–7 = L7→L1 → encapsulation[step-1]. Receiving: step 1–7 = L1→L7 → encapsulation[7-step]
  const layerData =
    encapsulation && currentStep >= 1 && currentStep <= 7
      ? isReceiving
        ? encapsulation[7 - currentStep] ?? null
        : encapsulation[currentStep - 1] ?? null
      : null;
  // When Realtime card is open, don't show the layer-detail block — only the realtime card content
  const displayLayerData = showDirectConnectionInfo ? null : layerData;

  // Auto-switch to receiving as soon as sending completes
  useEffect(() => {
    if (!isComplete) return;
    const t = setTimeout(startReceiving, 600);
    return () => clearTimeout(t);
  }, [isComplete, startReceiving]);

  // Auto: show layer at top → scroll slowly to bottom over scrollDurationMs → when at bottom, advance to next layer
  useEffect(() => {
    if (!autoAnimate || !isActive) return;
    const el = scrollContainerRef.current;
    if (!el) return;

    const runAdvance = () => {
      if (isHandshake && handshakeStep >= 1 && handshakeStep <= 3) {
        advanceHandshake();
      } else if (isSending && showDirectConnectionInfo) {
        setShowDirectConnectionInfo(false);
      } else if (isSending && currentStep >= 1 && currentStep <= 6) {
        goToStep(currentStep + 1);
      } else if (isSending && currentStep === 7) {
        goToStep(1, "receiving");
      } else if (isReceiving && currentStep >= 1 && currentStep <= 6) {
        goToStep(currentStep + 1);
      } else if (isReceiving && currentStep === 7 && autoRepeat) {
        if (isHandshakeConnection) {
          goToHandshake();
        } else {
          goToStep(1, "sending");
          setShowDirectConnectionInfo(true);
        }
      }
    };

    const hasNextStep =
      (isHandshake && handshakeStep >= 1 && handshakeStep <= 3) ||
      (isSending && (showDirectConnectionInfo || (currentStep >= 1 && currentStep <= 7))) ||
      (isReceiving && (currentStep <= 6 || (currentStep === 7 && autoRepeat)));
    if (!hasNextStep) return;

    // 1) Put current layer at top so layout is ready for measurement
    el.scrollTop = 0;

    let rafId: number;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const startScroll = () => {
      // Measure scroll distance after layout (correct when container height is small)
      const targetScroll = el.scrollHeight - el.clientHeight;

      if (targetScroll <= 0) {
        timeoutId = setTimeout(runAdvance, scrollMinMs);
        return;
      }

      // Duration from actual scroll height so speed is consistent (px/sec)
      const durationMs = Math.max(
        scrollMinMs,
        Math.min(scrollMaxMs, (targetScroll / scrollPxPerSec) * 1000)
      );

      let startTime: number | null = null;
      const tick = (now: number) => {
        if (startTime === null) startTime = now;
        const elapsed = now - startTime;
        const t = Math.min(elapsed / durationMs, 1);
        const eased = 1 - (1 - t) * (1 - t);
        const scrollTop = eased * targetScroll;
        el.scrollTop = scrollTop;
        // Advance as soon as we've reached the end, not when the timer runs out
        const atEnd = scrollTop >= targetScroll - 1 || t >= 1;
        if (atEnd) {
          el.scrollTop = targetScroll;
          runAdvance();
        } else {
          rafId = requestAnimationFrame(tick);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    // Measure and animate in next frame so scrollHeight/clientHeight are correct
    rafId = requestAnimationFrame(startScroll);

    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [autoAnimate, isActive, currentStep, handshakeStep, showDirectConnectionInfo, scrollPxPerSec, scrollMinMs, scrollMaxMs, goToStep, advanceHandshake, goToHandshake, isHandshakeConnection, autoRepeat, isHandshake, isSending, isReceiving]);

  const hasEncapsulation = encapsulation != null && encapsulation.length > 0;

  const handlePrevious = () => {
    if (phase === "handshake") {
      goBackHandshake();
    } else if (isReceiving && currentStep <= 1) {
      // At receiving Physical (L1) — cross back to sending Physical (last sending layer)
      goToStep(7, "sending");
    } else if (!isReceiving && currentStep <= 1 && !showDirectConnectionInfo) {
      // At sending Application (L7) — go back to the connection card
      if (isHandshakeConnection) {
        goToHandshake();
      } else {
        setShowDirectConnectionInfo(true);
      }
    } else {
      goToStep(Math.max(1, currentStep - 1), isReceiving ? "receiving" : "sending");
    }
  };
  const handleNext = () => {
    if (phase === "handshake") {
      advanceHandshake();
    } else if (showDirectConnectionInfo) {
      // Close the Realtime card and reveal sending L7 (Application)
      setShowDirectConnectionInfo(false);
    } else if (isReceiving) {
      goToStep(Math.min(7, currentStep + 1), "receiving");
    } else if (isSending && currentStep >= 7) {
      // Last sending layer (Physical) — cross directly to receiving Physical
      goToStep(1, "receiving");
    } else {
      goToStep(currentStep + 1, "sending");
    }
  };
  const isPreviousDisabled =
    phase === "handshake"
      ? handshakeStep <= 1
      : showDirectConnectionInfo  // already on the realtime card, nothing before it
        ? true
        : false;                  // every other state can navigate back
  const isNextDisabled =
    phase !== "handshake" && isReceiving && currentStep >= 7; // end of receiving chain

  // Keyboard: Left/Right = prev/next layer (scroll to top); Up/Down = scroll container
  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Node;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      if (isEditable) return;

      const el = scrollContainerRef.current;
      if (e.key === "ArrowLeft") {
        if (!isPreviousDisabled) {
          e.preventDefault();
          handlePrevious();
          if (el) el.scrollTop = 0;
        }
      } else if (e.key === "ArrowRight") {
        if (!isNextDisabled) {
          e.preventDefault();
          handleNext();
          if (el) el.scrollTop = 0;
        }
      } else if (e.key === "ArrowUp" && el) {
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll > 0) {
          e.preventDefault();
          el.scrollTop = Math.max(0, el.scrollTop - KEYBOARD_SCROLL_STEP_PX);
        }
      } else if (e.key === "ArrowDown" && el) {
        const maxScroll = el.scrollHeight - el.clientHeight;
        if (maxScroll > 0) {
          e.preventDefault();
          el.scrollTop = Math.min(maxScroll, el.scrollTop + KEYBOARD_SCROLL_STEP_PX);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, isPreviousDisabled, isNextDisabled, handlePrevious, handleNext]);

  return (
    <div className="flex flex-col h-full min-h-0 w-full">
      {isActive && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-shrink-0 mb-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-tertiary mt-0.5">
                {isHandshake && "Connection setup (3-way handshake). Click Next or wait for auto-advance."}
                {!isHandshake && !autoAnimate && "Click a layer to view its data. Enable Auto in the header to step automatically."}
                {!isHandshake && isActive && autoAnimate && "Steps advance automatically. You can still click any layer to jump."}
                {isComplete && "Transmission complete. Click a layer to review, or use the button below to view receiving side."}
                {isReceiving && "Receiving side: data moves from Physical (1) up to Application (7)."}
              </p>
            </div>
            {isHandshake && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg"
              >
                Connection setup: {HANDSHAKE_STEPS[handshakeStep - 1]?.label ?? "—"}
              </motion.span>
            )}
            {isReceiving && currentStep >= 1 && currentStep <= 7 && layerData && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg"
              >
                Receiving: Layer {layerData.layerNumber} — {layerData.layerName}
              </motion.span>
            )}
            {isSending && showDirectConnectionInfo && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg"
              >
                Realtime connection
              </motion.span>
            )}
            {isSending && !showDirectConnectionInfo && currentStep >= 1 && currentStep <= 7 && layerData && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-lg"
              >
                Viewing: Layer {layerData.layerNumber} — {layerData.layerName}
              </motion.span>
            )}
          </div>
        </motion.div>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 min-h-0 overflow-y-auto custom-scrollbar rounded-xl border border-border bg-card/50 p-3 sm:p-4 flex flex-col gap-4"
      >
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] py-8 px-4 sm:px-6 text-center"
          >
            <div className="relative mb-5">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/5"
              >
                <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-primary" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5 text-primary" />
              </motion.div>
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="text-lg sm:text-xl font-semibold text-foreground mb-1"
            >
              How it works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xs text-tertiary max-w-xs mb-5 leading-relaxed"
            >
              Type a message, choose medium & protocol in the header, then click <span className="text-foreground font-medium">Start simulation</span>.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-wrap justify-center gap-1.5"
            >
              {[7, 6, 5, 4, 3, 2, 1].map((num, i) => (
                <motion.span
                  key={num}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.04, duration: 0.25 }}
                  className="w-7 h-7 rounded-md border border-border/80 bg-card/70 flex items-center justify-center text-[10px] font-semibold text-foreground/60"
                >
                  {num}
                </motion.span>
              ))}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.3 }}
              className="text-[10px] text-tertiary/70 mt-3 font-medium tracking-wide"
            >
              Application → Physical
            </motion.p>
          </motion.div>
        )}

        {isActive && (
          <>
            {/* Layer buttons - two rows: Sending (7→1) and Receiving (1→7), each labeled */}
            <div className="space-y-3">
              {/* Row 1: Handshake (optional) + Sending label + sending layers + Prev/Next */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "rounded-2xl border border-border/80 p-3 sm:p-4",
                  "bg-gradient-to-br from-card to-muted/30",
                  "shadow-sm"
                )}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {isHandshakeConnection ? (
                    <motion.button
                      type="button"
                      onClick={() => hasEncapsulation && goToHandshake()}
                      disabled={!hasEncapsulation}
                      layout
                      animate={{
                        backgroundColor: isHandshake ? "var(--accent)" : "var(--card)",
                        borderColor: isHandshake ? "var(--primary)" : "var(--border)",
                      }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 inline-flex items-center gap-1.5",
                        hasEncapsulation && "cursor-pointer hover:bg-accent hover:border-primary/50 hover:shadow-md",
                        isHandshake && "ring-2 ring-primary/40 shadow-md",
                        !hasEncapsulation && "cursor-default opacity-80"
                      )}
                      title={hasEncapsulation ? "View 3-way handshake" : undefined}
                    >
                      <Handshake className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Handshake
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={() => hasEncapsulation && setShowDirectConnectionInfo(true)}
                      disabled={!hasEncapsulation}
                      layout
                      animate={{
                        backgroundColor: showDirectConnectionInfo ? "var(--accent)" : "var(--card)",
                        borderColor: showDirectConnectionInfo ? "var(--primary)" : "var(--border)",
                      }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 inline-flex items-center gap-1.5",
                        hasEncapsulation && "cursor-pointer hover:bg-accent hover:border-primary/50 hover:shadow-md",
                        showDirectConnectionInfo && "ring-2 ring-primary/40 shadow-md",
                        !hasEncapsulation && "cursor-default opacity-80"
                      )}
                      title={hasEncapsulation ? "About realtime connection" : undefined}
                    >
                      <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Realtime
                    </motion.button>
                  )}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto justify-end">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/20">
                      <ArrowUp className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Sending
                    </span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {OSI_LAYERS.map((layer, index) => {
                        const step = index + 1;
                        const isCurrent = !isReceiving && currentStep === step && !isHandshake && !showDirectConnectionInfo;
                        const canClick = hasEncapsulation && isActive;
                        return (
                          <motion.button
                            key={`send-${layer.number}`}
                            type="button"
                            onClick={() => {
                              if (!canClick) return;
                              setShowDirectConnectionInfo(false);
                              goToStep(step, "sending");
                            }}
                            disabled={!canClick}
                            layout
                            animate={{
                              backgroundColor: isCurrent ? "var(--accent)" : "var(--card)",
                              borderColor: isCurrent ? "var(--primary)" : "var(--border)",
                            }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 inline-flex items-center gap-1.5",
                              canClick && "cursor-pointer hover:bg-accent hover:border-primary/50 hover:shadow-md",
                              isCurrent && "ring-2 ring-primary/40 shadow-md",
                              !canClick && "cursor-default opacity-80"
                            )}
                            title={canClick ? `Show Layer ${layer.number}: ${layer.name}` : undefined}
                          >
                            {(() => {
                              const Icon = LAYER_ICONS[layer.number];
                              return Icon ? <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} /> : null;
                            })()}
                            <span>{layer.number} {layer.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Row 2: Prev/Next at start + Receiving label + receiving layers (1→7) */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className={cn(
                  "rounded-2xl border border-border/80 p-3 sm:p-4",
                  "bg-gradient-to-br from-card to-muted/20",
                  "shadow-sm"
                )}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {hasEncapsulation && isActive && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <motion.button
                        type="button"
                        onClick={handlePrevious}
                        disabled={isPreviousDisabled}
                        whileHover={{ scale: !isPreviousDisabled ? 1.05 : 1 }}
                        whileTap={{ scale: !isPreviousDisabled ? 0.95 : 1 }}
                        className={cn(
                          "rounded-xl border border-border p-2 transition-colors",
                          !isPreviousDisabled
                            ? "bg-muted text-foreground hover:bg-accent hover:border-primary/50 cursor-pointer"
                            : "opacity-50 cursor-not-allowed bg-muted"
                        )}
                        title={phase === "handshake" ? "Previous handshake step" : "Previous layer"}
                        aria-label={phase === "handshake" ? "Previous handshake step" : "Previous layer"}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        whileHover={{ scale: !isNextDisabled ? 1.05 : 1 }}
                        whileTap={{ scale: !isNextDisabled ? 0.95 : 1 }}
                        className={cn(
                          "rounded-xl border border-border p-2 transition-colors",
                          !isNextDisabled
                            ? "bg-muted text-foreground hover:bg-accent hover:border-primary/50 cursor-pointer"
                            : "opacity-50 cursor-not-allowed bg-muted"
                        )}
                        title={phase === "handshake" ? "Next handshake step" : "Next layer"}
                        aria-label={phase === "handshake" ? "Next handshake step" : "Next layer"}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 ml-auto justify-end">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary border border-primary/20">
                      <ArrowDown className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Receiving
                    </span>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {[...OSI_LAYERS].reverse().map((layer) => {
                        const step = layer.number;
                        const isCurrent = isReceiving && currentStep === step && !isHandshake;
                        const canClick = hasEncapsulation && isActive;
                        return (
                          <motion.button
                            key={`recv-${layer.number}`}
                            type="button"
                            onClick={() => canClick && goToStep(step, "receiving")}
                            disabled={!canClick}
                            layout
                            animate={{
                              backgroundColor: isCurrent ? "var(--accent)" : "var(--card)",
                              borderColor: isCurrent ? "var(--primary)" : "var(--border)",
                            }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "rounded-xl border px-3 py-2 text-xs font-medium transition-all duration-200 inline-flex items-center gap-1.5",
                              canClick && "cursor-pointer hover:bg-accent hover:border-primary/50 hover:shadow-md",
                              isCurrent && "ring-2 ring-primary/40 shadow-md",
                              !canClick && "cursor-default opacity-80"
                            )}
                            title={canClick ? `Show Layer ${layer.number}: ${layer.name}` : undefined}
                          >
                            {(() => {
                              const Icon = LAYER_ICONS[layer.number];
                              return Icon ? <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} /> : null;
                            })()}
                            <span>{layer.number} {layer.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            {hasEncapsulation && isActive && !isReceiving && (
              <p className="flex items-center gap-1.5 text-xs text-tertiary">
                <MousePointer className="w-3.5 h-3.5" />
                {isHandshake
                  ? "Connection setup (3-way handshake) below — or click a layer to jump to sending."
                  : showDirectConnectionInfo
                    ? "Realtime connection below — or click a layer to view its encapsulation."
                    : "Click any layer to view its input, what happened, and output."}
              </p>
            )}
            {hasEncapsulation && isReceiving && (
              <p className="flex items-center gap-1.5 text-xs text-tertiary">
                <ArrowUp className="w-3.5 h-3.5" />
                Receiving side: data moves 1 → 7. Click a layer to view decapsulation.
              </p>
            )}

            <AnimatePresence>
              {!isHandshakeConnection && showDirectConnectionInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5"
                >
                  {/* Header - same structure as 3-way handshake card */}
                  <div className="px-5 py-4 border-b border-border bg-card rounded-t-2xl">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                          className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                        >
                          <Zap className="w-5 h-5" strokeWidth={2.5} />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-foreground text-base tracking-tight">Realtime connection</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">No connection setup — data is sent and received directly</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body - same layout as 3-way handshake: Sender/Receiver grid + steps (realtime content, not simulation) */}
                  <div className="p-5 sm:p-6 bg-card rounded-b-2xl">
                    <div className="flex flex-col gap-0">
                      {/* Sender & Receiver labels - same as Client & Server in handshake */}
                      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-2">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border border-border">
                            <Monitor className="w-4 h-4 text-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground">Sender</span>
                        </div>
                        <div className="w-12" aria-hidden />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm font-medium text-foreground">Receiver</span>
                          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border border-border">
                            <Server className="w-4 h-4 text-foreground" />
                          </div>
                        </div>
                      </div>

                      {/* Realtime steps - same row structure as handshake, different content */}
                      {REALTIME_STEPS.map((step, index) => {
                        const isClientToServer = step.direction === "client-to-server";
                        const isServerToClient = step.direction === "server-to-client";
                        const isBidirectional = step.direction === "bidirectional";
                        return (
                          <motion.div
                            key={step.label}
                            initial={{ opacity: 0, x: isClientToServer ? -16 : isServerToClient ? 16 : 0 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-3 px-4 rounded-xl transition-all duration-300 bg-muted/30 border border-border/50"
                          >
                            <div className="flex justify-end">
                              {isClientToServer ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground shadow-md">
                                  {step.label}
                                </span>
                              ) : isBidirectional ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/80 text-primary-foreground border border-primary/30">
                                  ↔ Both
                                </span>
                              ) : (
                                <span className="w-16" />
                              )}
                            </div>
                            <div className="flex flex-col items-center gap-1 min-w-[80px]">
                              {isBidirectional ? (
                                <>
                                  <ArrowRight className="w-4 h-4 text-primary" />
                                  <ArrowLeft className="w-4 h-4 text-primary" />
                                </>
                              ) : isClientToServer ? (
                                <ArrowRight className="w-4 h-4 text-primary" />
                              ) : (
                                <ArrowLeft className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="flex justify-start">
                              {isServerToClient ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground shadow-md">
                                  {step.label}
                                </span>
                              ) : isBidirectional ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/80 text-primary-foreground border border-primary/30">
                                  ↔ Both
                                </span>
                              ) : (
                                <span className="w-16" />
                              )}
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Step descriptions - same idea as handshake but for realtime */}
                      <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4 space-y-2">
                        {REALTIME_STEPS.map((step, index) => (
                          <p key={step.label + index} className="text-sm text-foreground/90 leading-relaxed flex gap-2">
                            <span className="font-semibold text-primary shrink-0">{step.label}:</span>
                            <span>{step.desc}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isHandshake && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 overflow-hidden"
              >
                {/* Header - contrasting text on card bg */}
                <div className="px-5 py-4 border-b border-border bg-card rounded-t-2xl">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                      className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
                    >
                      <Handshake className="w-5 h-5" strokeWidth={2.5} />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-foreground text-base tracking-tight">TCP 3-Way Handshake</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Connection setup before data transfer</p>
                    </div>
                  </div>
                </div>

                {/* Sequence diagram - all steps visible, no hiding */}
                <div className="p-5 sm:p-6 bg-card">
                  <div className="flex flex-col gap-0">
                    {/* Client & Server labels */}
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <Monitor className="w-4 h-4 text-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Client</span>
                      </div>
                      <div className="w-12" aria-hidden />
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm font-medium text-foreground">Server</span>
                        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center border border-border">
                          <Server className="w-4 h-4 text-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Three message rows - always show all (no opacity hide) */}
                    {HANDSHAKE_STEPS.map((step, index) => {
                      const stepNum = index + 1;
                      const isActive = handshakeStep === stepNum;
                      const isPast = handshakeStep > stepNum;
                      const isClientToServer = step.direction === "client-to-server";
                      const showArrow = isActive || isPast;
                      return (
                        <motion.div
                          key={step.label}
                          initial={{ opacity: 0, x: isClientToServer ? -16 : 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className={cn(
                            "grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-3 px-4 rounded-xl transition-all duration-300",
                            isActive && "bg-muted/80 ring-1 ring-border dark:ring-border"
                          )}
                        >
                          {/* Left: Client */}
                          <div className="flex justify-end">
                            {isClientToServer ? (
                              <motion.span
                                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
                                  isActive && "bg-primary text-primary-foreground shadow-md",
                                  isPast && "bg-muted text-foreground border border-border",
                                  !isActive && !isPast && "bg-muted text-muted-foreground"
                                )}
                              >
                                {step.label}
                              </motion.span>
                            ) : (
                              <span className="w-16" />
                            )}
                          </div>
                          {/* Center: Arrow - show for both active and past steps */}
                          <div className="flex items-center justify-center">
                            {showArrow ? (
                              <div
                                className={cn(
                                  "flex items-center gap-0.5",
                                  isActive ? "text-foreground" : "text-foreground/70"
                                )}
                              >
                                {isClientToServer ? (
                                  <>
                                    <span className={cn("inline-block w-4 h-0.5 rounded-full", isActive ? "bg-foreground" : "bg-foreground/50")} />
                                    <ArrowRight className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                                    <span className={cn("inline-block w-4 h-0.5 rounded-full", isActive ? "bg-foreground" : "bg-foreground/50")} />
                                  </>
                                ) : (
                                  <>
                                    <span className={cn("inline-block w-4 h-0.5 rounded-full", isActive ? "bg-foreground" : "bg-foreground/50")} />
                                    <ArrowLeft className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
                                    <span className={cn("inline-block w-4 h-0.5 rounded-full", isActive ? "bg-foreground" : "bg-foreground/50")} />
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="w-8 h-px rounded-full bg-border" />
                            )}
                          </div>
                          {/* Right: Server */}
                          <div className="flex justify-start">
                            {!isClientToServer ? (
                              <motion.span
                                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                                transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold",
                                  isActive && "bg-primary text-primary-foreground shadow-md",
                                  isPast && "bg-muted text-foreground border border-border",
                                  !isActive && !isPast && "bg-muted text-muted-foreground"
                                )}
                              >
                                {step.label}
                              </motion.span>
                            ) : (
                              <span className="w-16" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* All step descriptions visible (accumulated), current highlighted */}
                  <div className="mt-5 rounded-xl border border-border bg-card p-4 space-y-3">
                    {HANDSHAKE_STEPS.map((step, index) => {
                      const stepNum = index + 1;
                      const isStepActive = handshakeStep === stepNum;
                      const isStepPast = handshakeStep > stepNum;
                      return (
                        <div
                          key={step.label}
                          className={cn(
                            "text-sm leading-relaxed rounded-lg px-3 py-2",
                            isStepActive && "bg-muted text-foreground border border-border",
                            isStepPast && "text-foreground opacity-100",
                            !isStepActive && !isStepPast && "text-muted-foreground"
                          )}
                        >
                          <span className="font-semibold text-foreground">{stepNum}. {step.label} — </span>
                          <span className={cn(
                            isStepPast && "text-foreground",
                            !isStepActive && !isStepPast && "text-muted-foreground"
                          )}>
                            {step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress dots */}
                  <div className="flex items-center justify-center gap-2 mt-5">
                    {[1, 2, 3].map((n) => (
                      <motion.div
                        key={n}
                        animate={{ scale: handshakeStep === n ? 1.2 : 1 }}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          handshakeStep >= n ? "bg-foreground" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>

                  {/* CTA - Back and Next / Start sending */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goBackHandshake}
                      disabled={handshakeStep <= 1}
                      className={cn(
                        "rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5",
                        handshakeStep > 1
                          ? "bg-muted text-foreground border border-border hover:bg-muted/80"
                          : "opacity-50 cursor-not-allowed bg-muted border border-border"
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={advanceHandshake}
                      className={cn(
                        "rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200",
                        handshakeStep >= 3
                          ? "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                          : "bg-muted text-foreground border border-border hover:bg-muted/80"
                      )}
                    >
                      {handshakeStep >= 3 ? "Start sending data →" : "Next step"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {!isHandshake && (
              <>
                <AnimatePresence mode="wait">
                  {displayLayerData && (
                    <motion.div
                      key={isReceiving ? `recv-${currentStep}` : currentStep}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-2xl border-2 border-primary/30 bg-card shadow-lg shadow-primary/5"
                    >
                      {/* ── Layer header ─────────────────────────────────────────── */}
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                        <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-xl font-bold shadow-md">
                          {displayLayerData.layerNumber}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground text-lg leading-tight">
                            Layer {displayLayerData.layerNumber} — {displayLayerData.layerName}
                          </h3>
                          <p className="text-xs text-tertiary mt-0.5">
                            PDU: <span className="font-medium text-foreground/80">{displayLayerData.pduName}</span>
                            {" · "}Output size: <span className="font-medium text-foreground/80">{displayLayerData.pduSizeBytes} bytes</span>
                            {" · "}<span className={isReceiving ? "text-blue-500 dark:text-blue-400" : "text-primary"}>{isReceiving ? "Decapsulation (receiving)" : "Encapsulation (sending)"}</span>
                          </p>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-4">
                        {/* ── 1. Layer Explanation ─────────────────────────────────── */}
                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[9px]">i</span>
                            About this Layer
                          </h4>
                          <p className="text-sm text-foreground/90 leading-relaxed">{displayLayerData.layerDescription}</p>
                        </div>

                        {/* ── 2. Protocols & Hardware ──────────────────────────────── */}
                        <div className="rounded-xl border border-border bg-background/40 p-4 space-y-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Protocols</p>
                            <div className="flex flex-wrap gap-1.5">
                              {displayLayerData.protocols.map((p) => (
                                <span key={p} className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Hardware / Devices</p>
                            <div className="flex flex-wrap gap-1.5">
                              {displayLayerData.hardware.map((h) => (
                                <span key={h} className="inline-block text-xs font-medium px-2 py-0.5 rounded-md bg-muted text-foreground/80 border border-border">
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* ── 3. What Happened ─────────────────────────────────────── */}
                        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                            {isReceiving ? "What Happened (Decapsulation)" : "What Happened (Encapsulation)"}
                          </h4>
                          <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                            {isReceiving
                              ? getDecapsulationDescription(displayLayerData.layerNumber, displayLayerData.pduName)
                              : displayLayerData.whatHappened}
                          </p>
                          {displayLayerData.headerFields.length > 0 && (
                            <div className="rounded-lg border border-border overflow-hidden">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-accent/60 border-b border-border">
                                    <th className="text-left py-2 px-3 font-medium text-foreground text-xs">Field</th>
                                    <th className="text-left py-2 px-3 font-medium text-foreground text-xs">Value</th>
                                    {displayLayerData.headerFields.some((f) => f.hex) && (
                                      <th className="text-left py-2 px-3 font-medium text-foreground text-xs">Hex</th>
                                    )}
                                  </tr>
                                </thead>
                                <tbody>
                                  {displayLayerData.headerFields.map((f, i) => (
                                    <tr key={i} className="border-b border-border/50 last:border-0">
                                      <td className="py-1.5 px-3 text-foreground/80 font-mono text-xs whitespace-nowrap">{f.name}</td>
                                      <td className="py-1.5 px-3 text-foreground text-xs break-all">{f.value}</td>
                                      {displayLayerData.headerFields.some((x) => x.hex) && (
                                        <td className="py-1.5 px-3 text-tertiary font-mono text-xs whitespace-nowrap">{f.hex ?? "—"}</td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                        {/* ── 4. INPUT ─────────────────────────────────────────────── */}
                        {(() => {
                          const inHuman = isReceiving ? displayLayerData.humanReadable ?? "" : displayLayerData.inputHumanReadable;
                          const inHex   = isReceiving ? displayLayerData.pduHex          : displayLayerData.inputHexFull;
                          const inBin   = isReceiving ? displayLayerData.outputBinary     : displayLayerData.inputBinary;
                          const inSize  = isReceiving ? displayLayerData.pduSizeBytes     : displayLayerData.inputSizeBytes;
                          const inLabel = isReceiving ? "from lower layer (received)" : "from upper layer";
                          const inArrow = isReceiving ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />;
                          return (
                            <div className="rounded-xl border border-border bg-background/40 overflow-hidden">
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
                                {inArrow}
                                <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
                                  Input — {inLabel}
                                </span>
                                <span className="ml-auto text-xs text-tertiary font-mono">{inSize} bytes = {inSize * 8} bits</span>
                              </div>
                              <div className="p-4 space-y-3">
                                {/* Human Readable */}
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Human Readable</p>
                                  <pre className="text-xs font-mono text-foreground/85 bg-card/60 rounded-lg p-3 overflow-x-auto border border-border whitespace-pre-wrap break-words leading-relaxed">
                                    {inHuman || "(no human-readable form)"}
                                  </pre>
                                </div>
                                {/* Hexadecimal */}
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Hexadecimal</p>
                                  <pre className="text-xs font-mono text-foreground/85 bg-card/60 rounded-lg p-3 overflow-x-auto border border-border whitespace-pre leading-relaxed">
                                    {formatHexForDisplay(inHex)}
                                  </pre>
                                </div>
                                {/* Binary */}
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Binary</p>
                                  <pre className="text-xs font-mono text-foreground/75 bg-card/60 rounded-lg p-3 overflow-x-auto border border-border whitespace-pre leading-relaxed">
                                    {inBin}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* ── 5. OUTPUT ────────────────────────────────────────────── */}
                        {(() => {
                          const outHuman = isReceiving ? displayLayerData.inputHumanReadable : displayLayerData.humanReadable ?? "";
                          const outHex   = isReceiving ? displayLayerData.inputHexFull       : displayLayerData.pduHex;
                          const outBin   = isReceiving ? displayLayerData.inputBinary        : displayLayerData.outputBinary;
                          const outSize  = isReceiving ? displayLayerData.inputSizeBytes     : displayLayerData.pduSizeBytes;
                          const outLabel = isReceiving ? "to upper layer" : "to lower layer";
                          const outArrow = isReceiving ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />;
                          return (
                            <div className="rounded-xl border border-primary/30 bg-primary/5 overflow-hidden">
                              <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border-b border-primary/20">
                                {outArrow}
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                  Output — {outLabel}
                                </span>
                                <span className="ml-auto text-xs text-tertiary font-mono">{outSize} bytes = {outSize * 8} bits</span>
                              </div>
                              <div className="p-4 space-y-3">
                                {/* Human Readable */}
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Human Readable</p>
                                  <pre className="text-xs font-mono text-foreground/85 bg-card/60 rounded-lg p-3 overflow-x-auto border border-border whitespace-pre-wrap break-words leading-relaxed">
                                    {outHuman || "(no human-readable form)"}
                                  </pre>
                                </div>
                                {/* Hexadecimal */}
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Hexadecimal</p>
                                  <pre className="text-xs font-mono text-foreground/85 bg-card/60 rounded-lg p-3 overflow-x-auto border border-border whitespace-pre leading-relaxed">
                                    {formatHexForDisplay(outHex)}
                                  </pre>
                                </div>
                                {/* Binary */}
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1.5">Binary</p>
                                  <pre className="text-xs font-mono text-foreground/75 bg-card/60 rounded-lg p-3 overflow-x-auto border border-border whitespace-pre leading-relaxed">
                                    {outBin}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* ── Electrical/signal visualization (Physical layer: send & receive) ── */}
                        {displayLayerData.layerNumber === 1 && (
                          <div className="rounded-xl border-2 border-primary/30 bg-card p-3">
                            <h4 className="text-sm font-medium text-foreground mb-1">
                              {isReceiving ? "Received signal on medium" : "Transmitted signal on medium"}
                            </h4>
                            <p className="text-xs text-tertiary mb-2">
                              {isReceiving
                                ? "Electrical (or optical/radio) representation of the frame as received at Layer 1."
                                : "Electrical (or optical/radio) representation of the frame as sent from Layer 1."}
                            </p>
                            <SignalVisualization medium={config.medium} pduHex={displayLayerData.pduHex} />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* When simulation is active but no layer selected (e.g. just completed). Hide when Realtime card is open. */}
                {!displayLayerData && !showDirectConnectionInfo && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-dashed border-border bg-card/30 p-6 text-center"
                  >
                    <p className="text-tertiary text-sm">
                      {isReceiving
                        ? "Click a layer above (1 Physical → 7 Application) to view decapsulation."
                        : "Click a layer above (7 Application → 1 Physical) to view its data."}
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </>
        )}

        {isComplete && encapsulation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/30 flex items-center gap-2"
          >
            <ArrowUp className="w-4 h-4 text-primary animate-bounce" />
            <p className="text-sm font-medium text-primary">
              Transmission complete — switching to receiving side…
            </p>
          </motion.div>
        )}

        {isSending && currentStep === 7 && layerData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/30"
          >
            <p className="text-sm font-medium text-primary">Encapsulation complete</p>
            <p className="text-xs text-tertiary mt-1">
              Data ready for transmission on the physical medium (Layer 1). Sending finished.
            </p>
          </motion.div>
        )}

        {isReceiving && currentStep === 7 && layerData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/30"
          >
            <p className="text-sm font-medium text-primary">Receive complete</p>
            <p className="text-xs text-tertiary mt-1">
              Message delivered to application (Layer 7). Decapsulation finished.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
