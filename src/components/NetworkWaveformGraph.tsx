"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react";
import { motion } from "framer-motion";
import type { TransmissionMedium } from "../types/osi";
import { cn } from "../lib/utils";

const SAMPLES_PER_BIT = 20;
/** Max bits to render (keeps total samples manageable) */
const MAX_BITS = 512;
/** Max points passed to chart (downsample when zoomed out to avoid hang) */
const MAX_CHART_POINTS = 600;
const MIN_ZOOM = 1;
const MAX_ZOOM = 256;
const ZOOM_STEP = 1.2;
const DEFAULT_BINARY =
  "0100100001100101011011000110110001101111001011000010000001010111011011110111001001101100011001000010000100010010";

function hexToBits(hex: string): string {
  const out: string[] = [];
  const str = hex.replace(/\s/g, "");
  for (let i = 0; i < str.length; i++) {
    const n = parseInt(str[i], 16);
    if (Number.isNaN(n)) continue;
    out.push(n.toString(2).padStart(4, "0"));
  }
  return out.join("");
}

interface DataPoint {
  x: number;
  y: number;
  bit: number;
  bitIndex: number;
  medium: TransmissionMedium;
}

interface NetworkWaveformGraphProps {
  medium: TransmissionMedium;
  pduHex?: string;
  binaryData?: string;
  height?: number;
  className?: string;
}

function generateWaveform(binaryData: string, medium: TransmissionMedium): DataPoint[] {
  const data: DataPoint[] = [];
  const totalSamples = binaryData.length * SAMPLES_PER_BIT;
  for (let i = 0; i < totalSamples; i++) {
    const bitIndex = Math.floor(i / SAMPLES_PER_BIT);
    const bit = parseInt(binaryData[bitIndex % binaryData.length] ?? "0", 10);
    data.push({ x: i, y: bit, bit, bitIndex, medium });
  }
  return data;
}

type LinePoint = { x: number; y: number; payload?: DataPoint };

function renderCustomizedLine(
  props: { points?: readonly LinePoint[]; stroke?: string; lineColor: string },
  selectedMedium: TransmissionMedium
) {
  const lineColor = props.lineColor;
  const raw = props.points ?? [];
  const points = raw.filter(
    (p): p is LinePoint => typeof p.x === "number" && typeof p.y === "number"
  );
  if (points.length < 2) return null;

  if (selectedMedium === "ethernet") {
    return (
      <g>
        {points.map((point, idx) => {
          if (idx === points.length - 1) return null;
          const nextPoint = points[idx + 1]!;
          return (
            <g key={`ethernet-${idx}`}>
              <line
                x1={point.x}
                y1={point.y}
                x2={point.x}
                y2={nextPoint.y}
                stroke={lineColor}
                strokeWidth={2}
                strokeDasharray="0"
              />
              <line
                x1={point.x}
                y1={nextPoint.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                stroke={lineColor}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>
    );
  }

  if (selectedMedium === "wifi") {
    return (
      <g>
        {points.map((point, idx) => {
          if (idx === points.length - 1) return null;
          const nextPoint = points[idx + 1]!;
          const amplitude = point.payload?.y === 0 ? 0.3 : 0.8;
          return (
            <g key={`wifi-${idx}`}>
              <path
                d={`M ${point.x} ${point.y} Q ${(point.x + nextPoint.x) / 2} ${point.y - amplitude * 10}, ${nextPoint.x} ${nextPoint.y}`}
                stroke={lineColor}
                fill="none"
                strokeWidth={2.5}
                opacity={0.8}
              />
              {idx % 3 === 0 && (
                <circle
                  cx={(point.x + nextPoint.x) / 2}
                  cy={point.y}
                  r={1.5}
                  fill={lineColor}
                  opacity={0.6}
                />
              )}
            </g>
          );
        })}
      </g>
    );
  }

  if (selectedMedium === "fiber") {
    return (
      <g>
        {points.map((point, idx) => {
          if (idx === points.length - 1) return null;
          const nextPoint = points[idx + 1]!;
          const isOn = point.payload?.y === 1;
          return (
            <g key={`fiber-${idx}`}>
              {isOn && (
                <defs>
                  <filter id={`waveform-glow-${idx}`}>
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              )}
              <line
                x1={point.x}
                y1={point.y}
                x2={nextPoint.x}
                y2={nextPoint.y}
                stroke={lineColor}
                strokeWidth={isOn ? 4 : 2}
                filter={isOn ? `url(#waveform-glow-${idx})` : "none"}
                opacity={isOn ? 1 : 0.5}
              />
              {isOn && idx % 4 === 0 && (
                <circle
                  cx={(point.x + nextPoint.x) / 2}
                  cy={(point.y + nextPoint.y) / 2}
                  r={2.5}
                  fill={lineColor}
                  opacity={0.8}
                  filter={`url(#waveform-glow-${idx})`}
                />
              )}
            </g>
          );
        })}
      </g>
    );
  }

  if (selectedMedium === "coaxial") {
    return (
      <g>
        {points.map((point, idx) => {
          if (idx === points.length - 1) return null;
          const nextPoint = points[idx + 1]!;
          const amplitude = point.payload?.y === 0 ? 0.2 : 0.9;
          return (
            <g key={`coaxial-${idx}`}>
              <path
                d={`M ${point.x} ${point.y - amplitude * 8} Q ${(point.x + nextPoint.x) / 2} ${point.y - amplitude * 5}, ${nextPoint.x} ${nextPoint.y - amplitude * 8}`}
                stroke={lineColor}
                fill="none"
                strokeWidth={1}
                strokeDasharray="2,2"
                opacity={0.5}
              />
              <path
                d={`M ${point.x} ${point.y} Q ${(point.x + nextPoint.x) / 2} ${point.y + amplitude * 15}, ${nextPoint.x} ${nextPoint.y}`}
                stroke={lineColor}
                fill="none"
                strokeWidth={2.5}
              />
              <path
                d={`M ${point.x} ${point.y + amplitude * 8} Q ${(point.x + nextPoint.x) / 2} ${point.y + amplitude * 5}, ${nextPoint.x} ${nextPoint.y + amplitude * 8}`}
                stroke={lineColor}
                fill="none"
                strokeWidth={1}
                strokeDasharray="2,2"
                opacity={0.5}
              />
            </g>
          );
        })}
      </g>
    );
  }

  if (selectedMedium === "radio") {
    return (
      <g>
        {points.map((point, idx) => {
          if (idx === points.length - 1) return null;
          const nextPoint = points[idx + 1]!;
          const frequency = point.payload?.y === 0 ? 2 : 4;
          return (
            <g key={`radio-${idx}`}>
              <path
                d={`M ${point.x} ${point.y} 
                   Q ${point.x + (nextPoint.x - point.x) * 0.25} ${point.y - (frequency === 4 ? 12 : 6)},
                     ${point.x + (nextPoint.x - point.x) * 0.5} ${point.y}
                   T ${nextPoint.x} ${nextPoint.y}`}
                stroke={lineColor}
                fill="none"
                strokeWidth={2.5}
              />
              {idx % 2 === 0 && (
                <>
                  <circle
                    cx={point.x + (nextPoint.x - point.x) * 0.25}
                    cy={point.y - (frequency === 4 ? 12 : 6)}
                    r={1}
                    fill={lineColor}
                    opacity={0.7}
                  />
                  <circle
                    cx={point.x + (nextPoint.x - point.x) * 0.75}
                    cy={point.y - (frequency === 4 ? 12 : 6)}
                    r={1}
                    fill={lineColor}
                    opacity={0.7}
                  />
                </>
              )}
            </g>
          );
        })}
      </g>
    );
  }

  return (
    <g>
      {points.map((point, idx) => {
        if (idx === points.length - 1) return null;
        const nextPoint = points[idx + 1]!;
        return (
          <line
            key={`line-${idx}`}
            x1={point.x}
            y1={point.y}
            x2={nextPoint.x}
            y2={nextPoint.y}
            stroke={lineColor}
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

const MEDIUM_TOOLTIP_COLOR: Record<TransmissionMedium, string> = {
  ethernet: "#ef4444",
  wifi: "#3b82f6",
  fiber: "#10b981",
  coaxial: "#f59e0b",
  radio: "#8b5cf6",
};

export default function NetworkWaveformGraph({
  medium,
  pduHex,
  binaryData,
  height = 400,
  className,
}: NetworkWaveformGraphProps) {
  const binaryDataResolved = useMemo(() => {
    const raw =
      pduHex != null && pduHex.length > 0
        ? hexToBits(pduHex)
        : binaryData ?? DEFAULT_BINARY;
    return raw.slice(0, MAX_BITS);
  }, [pduHex, binaryData]);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const waveformData = useMemo(
    () => generateWaveform(binaryDataResolved, medium),
    [binaryDataResolved, medium]
  );

  const filteredData = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(panOffset));
    const endIndex = Math.min(
      waveformData.length,
      Math.floor(startIndex + waveformData.length / zoomLevel)
    );
    const slice = waveformData.slice(startIndex, endIndex);
    if (slice.length <= MAX_CHART_POINTS) return slice;
    const step = slice.length / MAX_CHART_POINTS;
    const out: DataPoint[] = [];
    for (let i = 0; i < MAX_CHART_POINTS; i++) {
      const idx = Math.min(Math.floor(i * step), slice.length - 1);
      out.push(slice[idx]!);
    }
    return out;
  }, [waveformData, panOffset, zoomLevel]);

  const visibleBits = useMemo(() => {
    const startBitIndex = Math.floor(panOffset / SAMPLES_PER_BIT);
    const endBitIndex = Math.ceil(
      (panOffset + waveformData.length / zoomLevel) / SAMPLES_PER_BIT
    );
    return {
      start: startBitIndex,
      end: Math.min(endBitIndex, binaryDataResolved.length),
    };
  }, [panOffset, zoomLevel, waveformData.length, binaryDataResolved.length]);

  const handlePanStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
  }, []);

  const handlePanMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - dragStart;
      const visibleWidth = waveformData.length / zoomLevel;
      const maxPanOffset = Math.max(0, waveformData.length - visibleWidth);
      setPanOffset((prev) => {
        const newOffset = prev - delta * 2;
        return Math.max(0, Math.min(newOffset, maxPanOffset));
      });
      setDragStart(e.clientX);
    },
    [isDragging, dragStart, waveformData.length, zoomLevel]
  );

  const handlePanEnd = useCallback(() => setIsDragging(false), []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((prev) => Math.min(prev * ZOOM_STEP, MAX_ZOOM));
    } else {
      setZoomLevel((prev) => Math.max(prev / ZOOM_STEP, MIN_ZOOM));
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev * ZOOM_STEP, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev / ZOOM_STEP, MIN_ZOOM));
  }, []);

  const handleReset = useCallback(() => {
    setZoomLevel(1);
    setPanOffset(0);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const tooltipColor = MEDIUM_TOOLTIP_COLOR[medium];

  if (binaryDataResolved.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-card overflow-hidden flex items-center justify-center",
          className
        )}
        style={{ minHeight: height }}
      >
        <p className="text-sm text-tertiary">Run simulation to see signal waveform</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden p-6 shadow-sm space-y-4",
        className
      )}
    >
      {/* Transmission animation (same as previous SignalVisualization) */}
      <div className="space-y-1.5">
        <p className="text-[10px] font-medium text-tertiary">Transmission animation</p>
        <div className="min-h-[90px] flex items-center justify-center rounded-lg border border-border bg-background/30 p-2">
          {medium === "ethernet" && <EthernetAnimation />}
          {medium === "wifi" && <WifiAnimation />}
          {medium === "fiber" && <FiberAnimation />}
          {medium === "coaxial" && <CoaxialAnimation />}
          {medium === "radio" && <RadioAnimation />}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden">
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            title="Zoom out"
            aria-label="Zoom out"
            className={cn(
              "p-2.5 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-40 disabled:pointer-events-none",
              zoomLevel <= MIN_ZOOM && "cursor-not-allowed"
            )}
          >
            <ZoomOut className="w-4 h-4 text-foreground" />
          </button>
          <span className="flex items-center px-3 py-2 border-l border-border bg-accent/30 min-w-[4.5rem] justify-center font-mono text-sm text-foreground tabular-nums">
            {zoomLevel >= 10 ? zoomLevel.toFixed(0) : zoomLevel.toFixed(1)}×
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            title="Zoom in"
            aria-label="Zoom in"
            className={cn(
              "p-2.5 transition-colors hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card disabled:opacity-40 disabled:pointer-events-none border-l border-border",
              zoomLevel >= MAX_ZOOM && "cursor-not-allowed"
            )}
          >
            <ZoomIn className="w-4 h-4 text-foreground" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleReset}
          title="Reset view"
          aria-label="Reset view"
          className="p-2.5 rounded-lg border border-border bg-card hover:bg-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <RotateCcw className="w-4 h-4 text-foreground" />
        </button>
        <span className="ml-auto font-mono text-xs text-foreground/80 bg-background/80 py-1.5 px-2.5 rounded-md border border-border">
          Bits {visibleBits.start}–{visibleBits.end} / {binaryDataResolved.length}
        </span>
      </div>

      {/* Chart (pan/scroll only on this area) */}
      <div
        ref={containerRef}
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        tabIndex={-1}
        className={cn(
          "rounded-lg border border-border bg-background/30 overflow-hidden select-none outline-none focus:outline-none focus-visible:outline-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{ userSelect: "none", touchAction: "none" }}
      >
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="x" tick={false} stroke="var(--border)" />
            <YAxis
              tick={{ fill: "var(--tertiary)", fontSize: 12 }}
              stroke="var(--border)"
              domain={[-0.1, 1.1]}
              ticks={[0, 1]}
              type="number"
              width={30}
            />
            <Tooltip
              contentStyle={{
                background: "var(--background)",
                border: `1px solid ${tooltipColor}`,
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: tooltipColor }}
              formatter={(value) => (value === 0 ? "0" : "1")}
              labelFormatter={(label) => `Bit: ${String(label)}`}
            />
            <Line
              type="stepAfter"
              dataKey="y"
              stroke={tooltipColor}
              dot={false}
              strokeWidth={3}
              isAnimationActive={false}
              shape={(props) =>
                renderCustomizedLine(
                  {
                    points: (props.points ?? []) as readonly LinePoint[],
                    stroke: props.stroke,
                    lineColor: tooltipColor,
                  },
                  medium
                )
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-tertiary flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1">
          <span className="font-medium text-foreground/70">Scroll</span> on chart to zoom
        </span>
        <span className="flex items-center gap-1">
          <Move size={12} className="shrink-0 opacity-70" />
          <span className="font-medium text-foreground/70">Drag</span> to pan
        </span>
      </p>
    </div>
  );
}

/** Animated: twisted pair + electrical pulses */
function EthernetAnimation() {
  const pulseCount = 20;
  return (
    <div className="w-full flex flex-col gap-3 items-center">
      <div className="flex items-center justify-center gap-1">
        {[0, 1].map((wire) => (
          <motion.div
            key={wire}
            className="h-1 flex-1 max-w-[100px] rounded-full bg-gradient-to-r from-tertiary/40 to-primary/60"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: wire * 0.3 }}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-0.5">
        {[...Array(pulseCount)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1.5 h-6 rounded-sm bg-primary"
            animate={{ scaleY: [0.3, 1.2, 0.3], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/** Animated: concentric arcs */
function WifiAnimation() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-2 border-primary/60"
          style={{
            width: 20 + i * 18,
            height: 20 + i * 18,
            borderTopColor: "transparent",
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
      <div className="w-2.5 h-6 rounded-sm bg-primary/80" style={{ transform: "translateY(-3px)" }} />
    </div>
  );
}

/** Animated: moving light dots along fiber */
function FiberAnimation() {
  const dotCount = 10;
  return (
    <div className="w-full max-w-[160px] flex flex-col items-center gap-2">
      <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-tertiary/20 via-primary/30 to-tertiary/20 overflow-hidden">
        {[...Array(dotCount)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
            style={{ left: 0, top: "50%", transform: "translate(-50%, -50%)" }}
            animate={{ left: "100%" }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15, ease: "linear" }}
          />
        ))}
      </div>
      <span className="text-[10px] text-tertiary">Light pulses</span>
    </div>
  );
}

/** Animated: coaxial wave bars */
function CoaxialAnimation() {
  const bars = 16;
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center w-full max-w-[140px]">
        <div className="absolute w-full h-2 rounded-full bg-foreground/20" />
        <div className="absolute w-full h-1 rounded-full bg-card border border-border" />
        <div className="flex gap-0.5 justify-center relative">
          {[...Array(bars)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-4 rounded-full bg-primary/90"
              animate={{ scaleY: [0.4, 1.2, 0.4], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
      <span className="text-[10px] text-tertiary">Coaxial signal</span>
    </div>
  );
}

/** Animated: antenna + EM waves */
function RadioAnimation() {
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-1 h-6 bg-primary/80 rounded-full" />
      <div className="flex gap-1.5 -mt-1">
        <motion.div
          className="w-3 h-0.5 bg-primary/70 rounded-full origin-right"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <motion.div
          className="w-3 h-0.5 bg-primary/70 rounded-full origin-left"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/50"
          style={{
            width: 24 + i * 20,
            height: 24 + i * 20,
            bottom: -2,
            borderTopColor: "transparent",
          }}
          animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}
