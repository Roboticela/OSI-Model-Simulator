"use client";

import { motion } from "framer-motion";
import { MessageSquare, Play, FileText, Eraser, Lightbulb, Layers, Handshake, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useOSISimulator } from "../contexts/OSISimulatorContext";
import { cn } from "../lib/utils";

const EXAMPLE_MESSAGES = [
  "Hello! I hope this message finds you well.",
  "The quick brown fox jumps over the lazy dog.",
  "Sending love and good vibes your way today.",
  "What a beautiful day to learn something new.",
  "Data travels through seven layers—like a letter through many hands.",
];

function pickDifferentExample(currentMessage: string): string {
  const others = EXAMPLE_MESSAGES.filter((msg) => msg !== currentMessage);
  if (others.length === 0) return EXAMPLE_MESSAGES[0] ?? "";
  return others[Math.floor(Math.random() * others.length)] ?? EXAMPLE_MESSAGES[0] ?? "";
}

export default function OSIInputForm() {
  const { config, setConfig, startSending } = useOSISimulator();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 w-full flex-1 min-h-0"
    >
      <div className="space-y-2 flex-shrink-0">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MessageSquare className="w-4 h-4 text-primary" />
          Message
        </label>
        <textarea
          value={config.message}
          onChange={(e) => setConfig({ message: e.target.value })}
          placeholder="Enter the message to send..."
          rows={3}
          className={cn(
            "w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-tertiary",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "resize-none custom-scrollbar transition-colors"
          )}
        />
      </div>

      <div className="flex flex-wrap gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg gap-1.5 flex-1 min-w-0"
          onClick={() => setConfig({ message: pickDifferentExample(config.message) })}
        >
          <FileText className="w-3.5 h-3.5" />
          Example
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg gap-1.5"
          onClick={() => setConfig({ message: "" })}
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </Button>
      </div>

      <div className="space-y-2 flex-shrink-0">
        <label className="text-xs font-medium text-tertiary">Connection type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfig({ connectionType: "direct" })}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              (config.connectionType ?? "direct") === "direct"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:bg-accent"
            )}
          >
            <Zap className="w-4 h-4" />
            Direct / Realtime
          </button>
          <button
            type="button"
            onClick={() => setConfig({ connectionType: "handshake" })}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              config.connectionType === "handshake"
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:bg-accent"
            )}
          >
            <Handshake className="w-4 h-4" />
            3-way handshake
          </button>
        </div>
        <p className="text-[10px] text-tertiary">
          Direct: send immediately (e.g. WebSocket). Handshake: simulate TCP SYN / SYN-ACK / ACK first.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-shrink-0">
        <div className="space-y-1">
          <label className="text-xs font-medium text-tertiary">Source IP</label>
          <input
            type="text"
            value={config.sourceAddress ?? ""}
            onChange={(e) => setConfig({ sourceAddress: e.target.value })}
            placeholder="192.168.1.10"
            className={cn(
              "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-tertiary",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            )}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-tertiary">Destination IP</label>
          <input
            type="text"
            value={config.destAddress ?? ""}
            onChange={(e) => setConfig({ destAddress: e.target.value })}
            placeholder="93.184.216.34"
            className={cn(
              "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-tertiary",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            )}
          />
        </div>
      </div>

      {/* Fills remaining space with tips */}
      <div className="flex-1 min-h-[120px] flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-shrink min-w-0">
        <div className="rounded-xl border border-border bg-accent/10 p-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Tip</span>
          </div>
          <p className="text-xs text-tertiary leading-relaxed">
            Medium and protocol are set in the header. Change them anytime—even during a run—to see the simulation update.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-accent/10 p-3 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Layers</span>
          </div>
          <p className="text-xs text-tertiary leading-relaxed">
            7 Application → 1 Physical. Each layer adds headers; the right panel shows the real encapsulation and signal.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2 pb-8 flex-shrink-0 border-t border-border/50">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="default"
            size="lg"
            className="w-full rounded-xl gap-2 h-12"
            onClick={startSending}
          >
            <Play className="w-5 h-5" />
            Start simulation
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
