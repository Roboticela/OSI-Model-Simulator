"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { TransmissionMedium } from "../types/osi";
import { cn } from "../lib/utils";
import { ZoomIn, ZoomOut, Move, RotateCcw } from "lucide-react";

interface SignalVisualizationProps {
  medium: TransmissionMedium;
  /** Hex string of the frame/PDU (e.g. L2 frame) to render as signal graph */
  pduHex?: string;
  className?: string;
}

const mediumLabels: Record<TransmissionMedium, string> = {
  ethernet: "Electrical signal (twisted pair)",
  wifi: "Radio waves (2.4/5 GHz)",
  fiber: "Light pulses (optical)",
  coaxial: "Electrical signal (coaxial cable)",
  radio: "Electromagnetic waves",
};

/** Convert compact hex string to bit string */
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

/** Colors for high (1) and low (0) — two distinct levels, no digit labels on graph */
const COLOR_HIGH = "var(--primary)";
const COLOR_LOW = "var(--muted-foreground)";

/** Narrow waveform: small vertical range, no label row */
const WAVE_TOP = 4;
const WAVE_BOTTOM = 20;
const NARROW_GRAPH_HEIGHT = 24;

/** Renders a narrow waveform; levels shown only by color (no 0/1 text) */
function SignalGraphSvg({
  bits,
  graphWidth,
  padding,
  highY,
  lowY,
  stepX,
  viewBox,
  variant,
}: {
  bits: string;
  graphWidth: number;
  graphHeight: number;
  padding: number;
  highY: number;
  lowY: number;
  stepX: number;
  viewBox: { x: number; width: number; height: number };
  variant: "digital" | "modulated";
}) {
  const midY = (highY + lowY) / 2;
  const amp = (lowY - highY) / 2;
  const getY = (b: string) => (b === "1" ? highY : lowY);
  const heightScale = viewBox.width > 0 ? graphWidth / viewBox.width : 1;
  const signalScaleTransform = `translate(0, ${midY}) scale(1, ${heightScale}) translate(0, ${-midY})`;

  return (
    <svg
      viewBox={`${viewBox.x} 0 ${viewBox.width} ${viewBox.height}`}
      className="w-full block"
      style={{ minHeight: NARROW_GRAPH_HEIGHT, height: NARROW_GRAPH_HEIGHT }}
      preserveAspectRatio="none"
    >
      {variant === "digital" &&
        [...bits].map((bit, i) => {
          const x = padding + i * stepX;
          const xNext = padding + (i + 1) * stepX;
          const y = getY(bit);
          const yPrev = i === 0 ? y : getY(bits[i - 1]!);
          const color = bit === "1" ? COLOR_HIGH : COLOR_LOW;
          return (
            <g key={i} transform={signalScaleTransform}>
              <line x1={x} y1={yPrev} x2={x} y2={y} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
              <line x1={x} y1={y} x2={xNext} y2={y} stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </g>
          );
        })}
      {variant === "modulated" &&
        [...bits].map((bit, i) => {
          const x0 = padding + i * stepX;
          const x1 = padding + (i + 1) * stepX;
          const cx = (x0 + x1) / 2;
          const color = bit === "1" ? COLOR_HIGH : COLOR_LOW;
          const pathD =
            bit === "1"
              ? `M ${x0} ${midY} Q ${cx} ${midY - amp} ${x1} ${midY}`
              : `M ${x0} ${midY} L ${x1} ${midY}`;
          return (
            <g key={i} transform={signalScaleTransform}>
              <path d={pathD} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
    </svg>
  );
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;
const ZOOM_STEP = 1.4;

export default function SignalVisualization({ medium, pduHex = "", className }: SignalVisualizationProps) {
  const label = mediumLabels[medium];
  const bits = hexToBits(pduHex).slice(0, 256);
  const graphWidth = 400;
  const graphHeight = NARROW_GRAPH_HEIGHT;
  const padding = 12;
  const hasData = bits.length > 0;
  const n = bits.length;
  const stepX = n > 0 ? (graphWidth - 2 * padding) / n : 0;
  const highY = WAVE_TOP;
  const lowY = WAVE_BOTTOM;

  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, panX: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const viewWidth = graphWidth / zoom;
  const maxPanX = Math.max(0, graphWidth - viewWidth);
  const clampedPanX = Math.max(0, Math.min(maxPanX, panX));

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(MAX_ZOOM, z * ZOOM_STEP));
  }, []);
  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(MIN_ZOOM, z / ZOOM_STEP));
  }, []);
  const handleReset = useCallback(() => {
    setZoom(1);
    setPanX(0);
  }, []);

  const getClientX = useCallback((e: React.MouseEvent | React.TouchEvent): number => {
    if ("touches" in e && e.touches.length > 0) return e.touches[0].clientX;
    return (e as React.MouseEvent).clientX;
  }, []);

  const onPointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!hasData) return;
      setIsDragging(true);
      dragStart.current = { x: getClientX(e), panX: clampedPanX };
    },
    [hasData, clampedPanX, getClientX]
  );

  const onPointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const clientX = getClientX(e);
      const dx = clientX - dragStart.current.x;
      const scale = viewWidth / containerRef.current.clientWidth;
      // Drag right => content moves right with finger => view window moves left => decrease panX
      const newPan = dragStart.current.panX - dx * scale;
      setPanX(Math.max(0, Math.min(maxPanX, newPan)));
    },
    [isDragging, viewWidth, maxPanX, getClientX]
  );

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) e.preventDefault();
      onPointerMove(e);
    },
    [isDragging, onPointerMove]
  );

  return (
    <div className={cn("rounded-xl border border-border bg-card/80 overflow-hidden", className)}>
      <div className="px-3 py-2 border-b border-border bg-accent/30 flex items-center justify-between">
        <span className="text-xs font-medium text-foreground capitalize">{medium.replace("-", " ")}</span>
        <span className="text-[10px] text-tertiary">{label}</span>
      </div>
      <div className="p-3 space-y-4">
        {/* 1. Previous animation (always shown when we have data) */}
        {hasData && (
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
        )}

        {/* 2. Signal graph with zoom & pan */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium text-tertiary">Signal graph</p>
            {hasData && (
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  className="p-1.5 rounded-md border border-border bg-card hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  className="p-1.5 rounded-md border border-border bg-card hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-foreground" />
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-md border border-border bg-card hover:bg-accent"
                  title="Reset view"
                  aria-label="Reset view"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-foreground" />
                </button>
                <span className="text-[10px] text-tertiary ml-1 flex items-center gap-0.5">
                  <Move className="w-3 h-3" /> drag to pan
                </span>
              </div>
            )}
          </div>
          {!hasData && (
            <div className="min-h-[100px] flex items-center justify-center text-tertiary text-xs rounded-lg border border-dashed border-border">
              Run simulation to see signal graph
            </div>
          )}
          {hasData && (
            <div
              ref={containerRef}
              role="img"
              aria-label="Signal waveform"
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onTouchMove}
              onTouchEnd={onPointerUp}
              onTouchCancel={onPointerUp}
              className={cn(
                "w-full overflow-hidden rounded-lg border border-border bg-background/30 cursor-grab select-none touch-none",
                isDragging && "cursor-grabbing"
              )}
              style={{ touchAction: "none" }}
            >
              <div className="w-full min-h-[32px]">
                {medium === "ethernet" && (
                  <>
                    <div className="flex gap-0.5 items-center px-2 pt-0.5">
                      <div className="h-px flex-1 max-w-[48px] rounded-full bg-tertiary/50" />
                      <div className="h-px flex-1 max-w-[48px] rounded-full bg-tertiary/50" />
                    </div>
                    <SignalGraphSvg
                      bits={bits}
                      graphWidth={graphWidth}
                      graphHeight={graphHeight}
                      padding={padding}
                      highY={highY}
                      lowY={lowY}
                      stepX={stepX}
                      viewBox={{ x: clampedPanX, width: viewWidth, height: graphHeight }}
                      variant="digital"
                    />
                  </>
                )}
                {(medium === "wifi" || medium === "radio") && (
                  <SignalGraphSvg
                    bits={bits}
                    graphWidth={graphWidth}
                    graphHeight={graphHeight}
                    padding={padding}
                    highY={highY}
                    lowY={lowY}
                    stepX={stepX}
                    viewBox={{ x: clampedPanX, width: viewWidth, height: graphHeight }}
                    variant="modulated"
                  />
                )}
                {medium === "fiber" && (
                  <>
                    <div className="h-px rounded-full mx-2 mt-0.5 bg-gradient-to-r from-tertiary/20 via-primary/20 to-tertiary/20" />
                    <SignalGraphSvg
                      bits={bits}
                      graphWidth={graphWidth}
                      graphHeight={graphHeight}
                      padding={padding}
                      highY={highY}
                      lowY={lowY}
                      stepX={stepX}
                      viewBox={{ x: clampedPanX, width: viewWidth, height: graphHeight }}
                      variant="digital"
                    />
                  </>
                )}
                {medium === "coaxial" && (
                  <>
                    <div className="relative h-1 flex items-center mx-2 mt-0.5">
                      <div className="absolute inset-0 rounded-full bg-foreground/10" />
                      <div className="absolute inset-y-0 left-1 right-1 rounded-full bg-card border border-border" />
                    </div>
                    <SignalGraphSvg
                      bits={bits}
                      graphWidth={graphWidth}
                      graphHeight={graphHeight}
                      padding={padding}
                      highY={highY}
                      lowY={lowY}
                      stepX={stepX}
                      viewBox={{ x: clampedPanX, width: viewWidth, height: graphHeight }}
                      variant="digital"
                    />
                  </>
                )}
              </div>
            </div>
          )}
          {hasData && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[10px] text-tertiary">
                First {bits.length} bits · Zoom {zoom.toFixed(1)}× {maxPanX > 0 ? "· Drag to pan" : ""}
              </p>
              <div className="flex items-center gap-3 text-[10px] font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-1 rounded-full" style={{ backgroundColor: COLOR_LOW }} />
                  <span style={{ color: COLOR_LOW }}>0</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-1 rounded-full" style={{ backgroundColor: COLOR_HIGH }} />
                  <span style={{ color: COLOR_HIGH }}>1</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
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
        <motion.div className="w-3 h-0.5 bg-primary/70 rounded-full origin-right" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.div className="w-3 h-0.5 bg-primary/70 rounded-full origin-left" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
      </div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary/50"
          style={{ width: 24 + i * 20, height: 24 + i * 20, bottom: -2, borderTopColor: "transparent" }}
          animate={{ opacity: [0.1, 0.5, 0.1], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}
