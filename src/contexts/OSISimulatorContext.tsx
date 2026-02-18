"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  OSISimulationConfig,
  SimulationPhase,
  LayerEncapsulation,
} from "../types/osi";
import { buildEncapsulation } from "../lib/osiSimulation";

interface OSISimulatorContextType {
  config: OSISimulationConfig;
  setConfig: (config: Partial<OSISimulationConfig>) => void;
  currentStep: number; // 0 = idle; 1–7 = sending layer (7→1) or receiving layer (1→7); 8 = complete
  phase: SimulationPhase;
  /** During handshake: 1 = SYN, 2 = SYN-ACK, 3 = ACK (then transitions to sending) */
  handshakeStep: number;
  /** Real encapsulation data for each layer (set when simulation starts) */
  encapsulation: LayerEncapsulation[] | null;
  startSending: () => void;
  startReceiving: () => void;
  advanceHandshake: () => void;
  goBackHandshake: () => void;
  goToHandshake: () => void;
  /** Navigate to a specific step. Pass `side` to explicitly switch to 'sending' or 'receiving' phase. */
  goToStep: (step: number, side?: "sending" | "receiving") => void;
  reset: () => void;
}

const defaultConfig: OSISimulationConfig = {
  message: "Hello, World!",
  medium: "ethernet",
  protocol: "https",
  speed: "normal",
  sourceAddress: "192.168.1.10",
  destAddress: "93.184.216.34",
  autoAnimate: false,
  autoRepeat: false,
  connectionType: "direct",
};

const OSISimulatorContext = createContext<OSISimulatorContextType | undefined>(undefined);

export function OSISimulatorProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<OSISimulationConfig>(defaultConfig);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<SimulationPhase>("idle");
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [encapsulation, setEncapsulation] = useState<LayerEncapsulation[] | null>(null);

  const setConfig = useCallback((updates: Partial<OSISimulationConfig>) => {
    setConfigState((prev) => ({ ...prev, ...updates }));
  }, []);

  const startSending = useCallback(() => {
    const layers = buildEncapsulation(config);
    setEncapsulation(layers);
    const connectionType = config.connectionType ?? "direct";
    if (connectionType === "handshake") {
      setPhase("handshake");
      setHandshakeStep(1);
      setCurrentStep(0);
    } else {
      setPhase("sending");
      setHandshakeStep(0);
      setCurrentStep(1);
    }
  }, [config]);

  // When config changes during a run, rebuild encapsulation so simulation updates in real time
  useEffect(() => {
    if (phase !== "idle" && phase !== "handshake") {
      setEncapsulation(buildEncapsulation(config));
    }
  }, [config, phase]);

  const advanceHandshake = useCallback(() => {
    setHandshakeStep((s) => {
      if (s >= 3) {
        setPhase("sending");
        setCurrentStep(1);
        return 0;
      }
      return s + 1;
    });
  }, []);

  const goBackHandshake = useCallback(() => {
    setHandshakeStep((s) => (s > 1 ? s - 1 : s));
  }, []);

  const goToHandshake = useCallback(() => {
    setPhase("handshake");
    setHandshakeStep(1);
    setCurrentStep(0);
  }, []);

  const startReceiving = useCallback(() => {
    setPhase("receiving");
    setCurrentStep(1); // Start at Layer 1 (Physical) on receiver side
  }, []);

  const goToStep = useCallback((step: number, side?: "sending" | "receiving") => {
    setCurrentStep(step);
    if (step >= 8) {
      setPhase("complete");
      return;
    }
    if (step <= 0) {
      setPhase("idle");
      return;
    }
    // step 1–7: resolve phase
    if (side === "receiving") {
      setPhase("receiving");
    } else if (side === "sending") {
      setPhase("sending");
    } else {
      // default: exit handshake/complete → sending; keep sending/receiving unchanged
      setPhase((p) => (p === "complete" || p === "handshake" ? "sending" : p));
    }
    setHandshakeStep(0);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setPhase("idle");
    setHandshakeStep(0);
    setEncapsulation(null);
  }, []);

  return (
    <OSISimulatorContext.Provider
      value={{
        config,
        setConfig,
        currentStep,
        phase,
        handshakeStep,
        encapsulation,
        startSending,
        startReceiving,
        advanceHandshake,
        goBackHandshake,
        goToHandshake,
        goToStep,
        reset,
      }}
    >
      {children}
    </OSISimulatorContext.Provider>
  );
}

export function useOSISimulator() {
  const context = useContext(OSISimulatorContext);
  if (context === undefined) {
    throw new Error("useOSISimulator must be used within an OSISimulatorProvider");
  }
  return context;
}
