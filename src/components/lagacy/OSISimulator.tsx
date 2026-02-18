"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
import OSILayer from "./OSILayer";
import { processMessage } from "../../utils/lagacy/osiUtils";
import TransmissionMedia from "./TransmissionMedia";

const osiLayers = [
  {
    id: 7,
    name: "Application",
    description: "Provides network services to applications",
    color: "bg-purple-100 dark:bg-purple-900",
    borderColor: "border-purple-300 dark:border-purple-700",
  },
  {
    id: 6,
    name: "Presentation",
    description: "Translates, encrypts, and compresses data",
    color: "bg-indigo-100 dark:bg-indigo-900",
    borderColor: "border-indigo-300 dark:border-indigo-700",
  },
  {
    id: 5,
    name: "Session",
    description: "Establishes, manages, and terminates sessions",
    color: "bg-blue-100 dark:bg-blue-900",
    borderColor: "border-blue-300 dark:border-blue-700",
  },
  {
    id: 4,
    name: "Transport",
    description: "Provides reliable data transfer and flow control",
    color: "bg-green-100 dark:bg-green-900",
    borderColor: "border-green-300 dark:border-green-700",
  },
  {
    id: 3,
    name: "Network",
    description: "Routes data packets between networks",
    color: "bg-yellow-100 dark:bg-yellow-900",
    borderColor: "border-yellow-300 dark:border-yellow-700",
  },
  {
    id: 2,
    name: "Data Link",
    description: "Provides node-to-node data transfer and error detection",
    color: "bg-orange-100 dark:bg-orange-900",
    borderColor: "border-orange-300 dark:border-orange-700",
  },
  {
    id: 1,
    name: "Physical",
    description: "Transmits raw bit stream over physical medium",
    color: "bg-red-100 dark:bg-red-900",
    borderColor: "border-red-300 dark:border-red-700",
  },
];

const transmissionMediaTypes = [
  { id: "cable", name: "Copper Cable", speed: "1 Gbps", reliability: "High", range: "100m", description: "Uses electrical signals through copper wires" },
  { id: "fiber", name: "Optical Fiber", speed: "10+ Gbps", reliability: "Very High", range: "10+ km", description: "Uses light pulses through glass or plastic fibers" },
  { id: "wireless", name: "Wireless", speed: "450+ Mbps", reliability: "Medium", range: "30-100m", description: "Uses radio waves through air" }
];

interface SimulationData {
  originalMessage: string;
  layers: {
    [key: number]: {
      sending: {
        data: string;
        protocols: string;
        processes: string[];
        rawData?: string;
        addedData?: string;
        finalData?: string;
        binaryRepresentation?: string;
        signalPattern?: string;
        handshakeData?: {
          syn: string;
          synAck: string;
          ack: string;
        };
      };
      receiving: {
        data: string;
        protocols: string;
        processes: string[];
        rawData?: string;
        addedData?: string;
        finalData?: string;
        binaryRepresentation?: string;
        signalPattern?: string;
      };
    };
  };
}

export default function OSISimulator() {
  const [userMessage, setUserMessage] = useState("");
  const [simulationActive, setSimulationActive] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationData, setSimulationData] = useState<SimulationData | null>(null);
  const [simulationDirection, setSimulationDirection] = useState<"sending" | "receiving">("sending");
  const [showConnectionSetup, setShowConnectionSetup] = useState(false);
  const [showOSIInfo, setShowOSIInfo] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(true);
  const [autoStep, setAutoStep] = useState(false);
  const [stepDelay, setStepDelay] = useState(2000);
  const [isPaused, setIsPaused] = useState(false);
  const [showTransmissionAnimation, setShowTransmissionAnimation] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState("cable");
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [showRestartButton, setShowRestartButton] = useState(false);
  
  const autoStepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const simulationContainerRef = useRef<HTMLDivElement>(null);

  const getPhysicalLayerBinaryData = () => {
    if (!simulationData || !simulationData.layers || !simulationData.layers[1]) {
      return "";
    }
    
    return simulationData.layers[1].sending.binaryRepresentation || "";
  };

  const handleAutoModeChange = (mode: 'step' | 'scroll' | 'none') => {
    if (mode === 'step') {
      setAutoStep(true);
    } else if (mode === 'scroll') {
      setAutoStep(false);
    } else {
      setAutoStep(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    
    const data = processMessage(userMessage, selectedMedia);
    setSimulationData(data);
    setSimulationActive(true);
    setSimulationStep(0);
    setSimulationDirection("sending");
    setShowConnectionSetup(true);
    setIsPaused(false);
    setShowContinueButton(false);
    setShowRestartButton(false);
    
    if (autoStepIntervalRef.current) {
      clearInterval(autoStepIntervalRef.current);
      autoStepIntervalRef.current = null;
    }
    
    if (simulationContainerRef.current) {
      setTimeout(() => {
        simulationContainerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleNextStep = useCallback(() => {
    if (simulationDirection === "sending") {
      if (simulationStep < osiLayers.length - 1) {
        setSimulationStep(simulationStep + 1);
        setTimeout(() => {
          const activeLayerElement = document.getElementById(`osi-layer-${7 - (simulationStep + 1)}`);
          if (activeLayerElement) {
            activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      } else {
        if (autoStep) {
          if (autoStepIntervalRef.current) {
            clearInterval(autoStepIntervalRef.current);
            autoStepIntervalRef.current = null;
          }
          setShowContinueButton(true);
          return;
        }
        
        setShowTransmissionAnimation(true);
        
        const transmissionTime = selectedMedia === "fiber" ? 1000 : 
                               selectedMedia === "wireless" ? 3000 : 2000;
        
        setTimeout(() => {
          setShowTransmissionAnimation(false);
          setSimulationDirection("receiving");
          setSimulationStep(osiLayers.length - 1);
          setShowConnectionSetup(false);
          
          setTimeout(() => {
            const activeLayerElement = document.getElementById(`osi-layer-${7 - (osiLayers.length - 1)}`);
            if (activeLayerElement) {
              activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 50);
        }, transmissionTime);
        
        if (autoStepIntervalRef.current) {
          clearInterval(autoStepIntervalRef.current);
          autoStepIntervalRef.current = null;
        }
        
        return; 
      }
    } else {
      if (simulationStep > 0) {
        setSimulationStep(simulationStep - 1);
        setTimeout(() => {
          const activeLayerElement = document.getElementById(`osi-layer-${7 - (simulationStep - 1)}`);
          if (activeLayerElement) {
            activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      } else {
        if (autoStep) {
          if (autoStepIntervalRef.current) {
            clearInterval(autoStepIntervalRef.current);
            autoStepIntervalRef.current = null;
          }
          setShowRestartButton(true);
          return;
        }
        
        setSimulationDirection("sending");
        setSimulationStep(0);
        setShowConnectionSetup(true);
        
        setTimeout(() => {
          const activeLayerElement = document.getElementById(`osi-layer-${7 - 0}`);
          if (activeLayerElement) {
            activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      }
    }
  }, [simulationDirection, simulationStep, selectedMedia, autoStep]);

  const handlePreviousStep = useCallback(() => {
    if (simulationDirection === "sending") {
      if (simulationStep > 0) {
        setSimulationStep(simulationStep - 1);
        setTimeout(() => {
          const activeLayerElement = document.getElementById(`osi-layer-${7 - (simulationStep - 1)}`);
          if (activeLayerElement) {
            activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      } else {
        setSimulationDirection("receiving");
        setSimulationStep(0);
        setShowConnectionSetup(false);
        
        setTimeout(() => {
          const activeLayerElement = document.getElementById(`osi-layer-${7 - 0}`);
          if (activeLayerElement) {
            activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      }
    } else {
      if (simulationStep < osiLayers.length - 1) {
        setSimulationStep(simulationStep + 1);
        setTimeout(() => {
          const activeLayerElement = document.getElementById(`osi-layer-${7 - (simulationStep + 1)}`);
          if (activeLayerElement) {
            activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 50);
      } else {    
        setShowTransmissionAnimation(true);
        
        const transmissionTime = selectedMedia === "fiber" ? 1000 : 
                               selectedMedia === "wireless" ? 3000 : 2000;
        
        setTimeout(() => {
          setShowTransmissionAnimation(false);
          setSimulationDirection("sending");
          setSimulationStep(osiLayers.length - 1);
          setShowConnectionSetup(true);
          
          setTimeout(() => {
            const activeLayerElement = document.getElementById(`osi-layer-${7 - (osiLayers.length - 1)}`);
            if (activeLayerElement) {
              activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 50);
        }, transmissionTime);
      }
    }
  }, [simulationDirection, simulationStep, selectedMedia]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!simulationActive) return;
      
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextStep();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePreviousStep();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [simulationActive, handleNextStep, handlePreviousStep]);

  const handleContinue = () => {
    setShowContinueButton(false);
    setShowTransmissionAnimation(true);
    
    const transmissionTime = selectedMedia === "fiber" ? 1000 : 
                           selectedMedia === "wireless" ? 3000 : 2000;
    
    setTimeout(() => {
      setShowTransmissionAnimation(false);
      setSimulationDirection("receiving");
      setSimulationStep(osiLayers.length - 1); 
      setShowConnectionSetup(false);
      
      setTimeout(() => {
        const activeLayerElement = document.getElementById(`osi-layer-${7 - (osiLayers.length - 1)}`);
        if (activeLayerElement) {
          activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
      
      if (autoStep && !isPaused) {
        if (autoStepIntervalRef.current) {
          clearInterval(autoStepIntervalRef.current);
          autoStepIntervalRef.current = null;
        }
        
        setTimeout(() => {
          const receivingInterval = setInterval(() => {
            setSimulationStep((prevStep) => {
              
              if (prevStep > 0) {
                const newStep = prevStep - 1;
                setTimeout(() => {
                  const activeLayerElement = document.getElementById(`osi-layer-${7 - newStep}`);
                  if (activeLayerElement) {
                    activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 50);
                return newStep;
              } else {
                clearInterval(receivingInterval);
                setShowRestartButton(true);
                return 0;
              }
            });
          }, stepDelay);
          
          autoStepIntervalRef.current = receivingInterval;
        }, 300); 
      }
    }, transmissionTime);
  };

  const handleRestart = () => {
    setShowRestartButton(false);
    setSimulationDirection("sending");
    setSimulationStep(0); 
    setShowConnectionSetup(true);
    
    setTimeout(() => {
      const activeLayerElement = document.getElementById(`osi-layer-${7 - 0}`);
      if (activeLayerElement) {
        activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
    
    if (autoStep && !isPaused) {
      if (autoStepIntervalRef.current) {
        clearInterval(autoStepIntervalRef.current);
        autoStepIntervalRef.current = null;
      }
      
      setTimeout(() => {
        const sendingInterval = setInterval(() => {
          setSimulationStep((prevStep) => {
            if (prevStep < osiLayers.length - 1) {
              const newStep = prevStep + 1;
              setTimeout(() => {
                const activeLayerElement = document.getElementById(`osi-layer-${7 - newStep}`);
                if (activeLayerElement) {
                  activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 50);
              return newStep;
            } else {
              clearInterval(sendingInterval);
              setShowContinueButton(true);
              return osiLayers.length - 1;
            }
          });
        }, stepDelay);
        
        autoStepIntervalRef.current = sendingInterval;
      }, 300); 
    }
  };

  useEffect(() => {
    if (!simulationActive || !autoStep || isPaused || showContinueButton || showRestartButton) {
      if (autoStepIntervalRef.current) {
        clearInterval(autoStepIntervalRef.current);
        autoStepIntervalRef.current = null;
      }
      return;
    }
    
    if (autoStepIntervalRef.current) {
      clearInterval(autoStepIntervalRef.current);
      autoStepIntervalRef.current = null;
    }
    
    if (autoStep) {
      autoStepIntervalRef.current = setInterval(() => {
        if (simulationDirection === "sending") {
          setSimulationStep(prevStep => {
            if (prevStep < osiLayers.length - 1) {
              const newStep = prevStep + 1;
              setTimeout(() => {
                const activeLayerElement = document.getElementById(`osi-layer-${7 - newStep}`);
                if (activeLayerElement) {
                  activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 50);
              return newStep;
            } else {
              if (autoStepIntervalRef.current) {
                clearInterval(autoStepIntervalRef.current);
                autoStepIntervalRef.current = null;
              }
              setShowContinueButton(true);
              return osiLayers.length - 1;
            }
          });
        } else {
          setSimulationStep(prevStep => {
            if (prevStep > 0) {
              const newStep = prevStep - 1;
              setTimeout(() => {
                const activeLayerElement = document.getElementById(`osi-layer-${7 - newStep}`);
                if (activeLayerElement) {
                  activeLayerElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 50);
              return newStep;
            } else {
              if (autoStepIntervalRef.current) {
                clearInterval(autoStepIntervalRef.current);
                autoStepIntervalRef.current = null;
              }
              setShowRestartButton(true);
              return 0;
            }
          });
        }
      }, stepDelay);
    }
    
    return () => {
      if (autoStepIntervalRef.current) {
        clearInterval(autoStepIntervalRef.current);
        autoStepIntervalRef.current = null;
      }
    };
  }, [simulationActive, autoStep, isPaused, stepDelay, simulationDirection, showContinueButton, showRestartButton]);

  const resetSimulation = () => {
    setSimulationActive(false);
    setSimulationStep(0);
    setSimulationData(null);
    setUserMessage("");
    setShowConnectionSetup(false);
    setIsPaused(false);
    setShowTransmissionAnimation(false);
    setShowContinueButton(false);
    setShowRestartButton(false);
    
    if (autoStepIntervalRef.current) {
      clearInterval(autoStepIntervalRef.current);
      autoStepIntervalRef.current = null;
    }
  };

  const togglePause = () => {
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);
    
    if (autoStep) {
      if (newPausedState) {
        if (autoStepIntervalRef.current) {
          clearInterval(autoStepIntervalRef.current);
          autoStepIntervalRef.current = null;
        }
      } else {
        if (autoStep) { 
          if ((simulationDirection === "sending" && simulationStep === osiLayers.length - 1) ||
              (simulationDirection === "receiving" && simulationStep === 0)) {
            return;
          }
          
          if (autoStepIntervalRef.current) {
            clearInterval(autoStepIntervalRef.current);
          }
          
          const newInterval = setInterval(() => {
            if (simulationDirection === "sending") {
              setSimulationStep(prevStep => {
                if (prevStep < osiLayers.length - 1) {
                  return prevStep + 1;
                } else {
                  clearInterval(newInterval);
                  setShowContinueButton(true);
                  return osiLayers.length - 1;
                }
              });
            } else {
              setSimulationStep(prevStep => {
                if (prevStep > 0) {
                  return prevStep - 1;
                } else {
                  clearInterval(newInterval);
                  setShowRestartButton(true);
                  return 0;
                }
              });
            }
          }, stepDelay);
          
          autoStepIntervalRef.current = newInterval;
        }
      }
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDelay = parseInt(e.target.value);
    setStepDelay(newDelay);
  };

  const getCurrentLayerName = () => {
    const currentLayerId = simulationDirection === "sending" 
      ? 7 - simulationStep 
      : 7 - simulationStep;
    
    const currentLayer = osiLayers.find(layer => layer.id === currentLayerId);
    return currentLayer ? currentLayer.name : "";
  };

  const getSelectedMediaDetails = () => {
    return transmissionMediaTypes.find(media => media.id === selectedMedia);
  };

  const getCurrentStepNumber = () => {
    if (simulationDirection === "sending") {
      return simulationStep + 1;
    } else {
      return osiLayers.length + (osiLayers.length - simulationStep);
    }
  };

  const renderConnectionSetup = () => {
    if (!showConnectionSetup || !simulationData) return null;
    
    const transportLayer = simulationData.layers[4]?.sending;
    const handshakeData = transportLayer?.handshakeData;
    
    return (
      <div className="p-4 border rounded-md bg-blue-50 dark:bg-blue-900/30 mb-6">
        <h3 className="text-lg font-medium mb-2">Connection Setup</h3>
        <p className="mb-4">
          Before data transmission begins, a connection is established between the sender and receiver.
        </p>
        
        {handshakeData && (
          <div className="bg-white dark:bg-gray-800 p-4 rounded border mb-4">
            <h4 className="text-sm font-medium mb-3">TCP Three-Way Handshake</h4>
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="text-center font-medium">Sender</div>
              <div className="text-center font-medium">Receiver</div>
            </div>
            
            <div className="space-y-6 relative">
              {/* Connection line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 z-0"></div>
              
              {/* Step 1: SYN */}
              <div className="flex items-center relative z-10">
                <div className="w-5/12 text-right pr-4">
                  <div className="inline-block bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded">
                    <p className="font-medium text-xs">SYN</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{handshakeData.syn}</p>
                    <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">Flags: SYN=1, ACK=0</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Initiates connection</p>
                  </div>
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">1</div>
                </div>
                <div className="w-5/12"></div>
              </div>
              
              {/* Arrow from sender to receiver */}
              <div className="flex items-center">
                <div className="w-5/12"></div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-blue-500 border-b-8 border-b-transparent animate-pulse"></div>
                  <div className="flex-1 h-0.5 bg-blue-500"></div>
                </div>
                <div className="w-5/12"></div>
              </div>
              
              {/* Step 2: SYN-ACK */}
              <div className="flex items-center relative z-10">
                <div className="w-5/12"></div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">2</div>
                </div>
                <div className="w-5/12 pl-4">
                  <div className="inline-block bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded">
                    <p className="font-medium text-xs">SYN-ACK</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{handshakeData.synAck}</p>
                    <p className="text-xs mt-1 text-green-600 dark:text-green-400">Flags: SYN=1, ACK=1</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Acknowledges request & sends own sequence</p>
                  </div>
                </div>
              </div>
              
              {/* Arrow from receiver to sender */}
              <div className="flex items-center">
                <div className="w-5/12"></div>
                <div className="w-2/12 flex justify-center">
                  <div className="flex-1 h-0.5 bg-green-500"></div>
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-green-500 border-b-8 border-b-transparent animate-pulse"></div>
                </div>
                <div className="w-5/12"></div>
              </div>
              
              {/* Step 3: ACK */}
              <div className="flex items-center relative z-10">
                <div className="w-5/12 text-right pr-4">
                  <div className="inline-block bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded">
                    <p className="font-medium text-xs">ACK</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{handshakeData.ack}</p>
                    <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">Flags: SYN=0, ACK=1</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Acknowledges receiver&apos;s sequence</p>
                  </div>
                </div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">3</div>
                </div>
                <div className="w-5/12"></div>
              </div>
              
              {/* Arrow from sender to receiver */}
              <div className="flex items-center">
                <div className="w-5/12"></div>
                <div className="w-2/12 flex justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-blue-500 border-b-8 border-b-transparent animate-pulse"></div>
                  <div className="flex-1 h-0.5 bg-blue-500"></div>
                </div>
                <div className="w-5/12"></div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-green-600 dark:text-green-400 font-medium">
              Connection Established ✓
            </div>
            
            <div className="mt-4 bg-gray-50 dark:bg-gray-900 p-3 rounded border">
              <h5 className="text-xs font-medium mb-1">Connection Details:</h5>
              <ul className="text-xs space-y-1 list-disc pl-4">
                <li>Initial Sequence Number (ISN): 1000</li>
                <li>Window Size: 64240 bytes</li>
                <li>Maximum Segment Size (MSS): 1460 bytes</li>
                <li>Connection State: ESTABLISHED</li>
              </ul>
            </div>
          </div>
        )}
        
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Three-way handshake (SYN, SYN-ACK, ACK) at Transport layer</li>
          <li>IP address resolution at Network layer</li>
          <li>MAC address resolution via ARP at Data Link layer</li>
          <li>Physical medium: {getSelectedMediaDetails()?.name}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {!simulationActive ? (
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="relative p-8 md:p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg mb-6">
                  <img src="/LagacyFavicon.svg" alt="OSI Simulator Icon" className="w-18 h-18" width={72} height={72} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  OSI Model Simulator
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Experience the journey of data through all seven layers of the OSI model with our interactive, step-by-step simulation
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    Use arrow keys to navigate through layers during simulation
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-colors"></div>
              <div className="relative p-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Layers</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Navigate through all 7 OSI layers and see how data is processed at each level
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 group-hover:from-green-500/10 group-hover:to-emerald-500/10 transition-colors"></div>
              <div className="relative p-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Real-time Visualization</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Watch data transformation with live animations and transmission media simulation
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-colors"></div>
              <div className="relative p-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Educational Content</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Learn with detailed explanations, protocols, and step-by-step processes
                </p>
              </div>
            </div>
          </div>

          {/* OSI Model Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">About the OSI Model</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Understanding the seven-layer networking framework
                  </p>
                </div>
                <button 
                  onClick={() => setShowOSIInfo(!showOSIInfo)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium"
                >
                  {showOSIInfo ? "Hide Details" : "Learn More"}
                  <svg className={`ml-2 w-4 h-4 transition-transform ${showOSIInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            {showOSIInfo && (
              <div className="p-6 space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    The OSI (Open Systems Interconnection) model is a conceptual framework that standardizes 
                    the functions of a telecommunication or computing system into seven distinct layers. 
                    Each layer serves a specific purpose and communicates with the layers directly above and below it.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                      Upper Layers (Host Layers)
                    </h3>
                    <div className="space-y-3">
                      {[
                        { layer: 7, name: "Application", desc: "User interface and network services", color: "bg-purple-500" },
                        { layer: 6, name: "Presentation", desc: "Data translation, encryption, compression", color: "bg-indigo-500" },
                        { layer: 5, name: "Session", desc: "Session management and dialog control", color: "bg-blue-500" }
                      ].map((item) => (
                        <div key={item.layer} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white text-sm font-bold mr-3`}>
                            {item.layer}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      Lower Layers (Media Layers)
                    </h3>
                    <div className="space-y-3">
                      {[
                        { layer: 4, name: "Transport", desc: "End-to-end connections and reliability", color: "bg-green-500" },
                        { layer: 3, name: "Network", desc: "Routing and logical addressing", color: "bg-yellow-500" },
                        { layer: 2, name: "Data Link", desc: "Node-to-node delivery and error detection", color: "bg-orange-500" },
                        { layer: 1, name: "Physical", desc: "Physical transmission of raw bits", color: "bg-red-500" }
                      ].map((item) => (
                        <div key={item.layer} className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                          <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center text-white text-sm font-bold mr-3`}>
                            {item.layer}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Data Encapsulation Process
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sending (Encapsulation)</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Data → Application processing</li>
                        <li>• Data → Presentation formatting</li>
                        <li>• Data → Session establishment</li>
                        <li>• Segments → Transport headers</li>
                        <li>• Packets → Network headers</li>
                        <li>• Frames → Data Link headers</li>
                        <li>• Bits → Physical transmission</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Receiving (De-encapsulation)</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• Bits → Frame reconstruction</li>
                        <li>• Frames → Packet extraction</li>
                        <li>• Packets → Segment reassembly</li>
                        <li>• Segments → Session data</li>
                        <li>• Data → Presentation processing</li>
                        <li>• Data → Application delivery</li>
                        <li>• Final → User application</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Simulation Setup */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Start Your Simulation</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Configure your message and transmission settings
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Message Input */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white">
                  Your Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="w-full p-4 pr-12 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors"
                    placeholder="Enter the message you want to simulate through the OSI layers..."
                    rows={3}
                    required
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {userMessage.length} characters
                  </div>
                </div>
              </div>
              
              {/* Settings Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Simulation Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Simulation Settings</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
                      <div className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={showDetailedView}
                          onChange={() => setShowDetailedView(!showDetailedView)}
                        />
                        <div className="checkbox-icon">
                          {showDetailedView && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">Detailed View</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Show comprehensive layer information</div>
                      </div>
                    </label>
                    
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Simulation Mode</div>
                      
                      <div className="space-y-2">
                        <label className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                          <div className="custom-radio">
                            <input
                              type="radio"
                              name="simulationMode"
                              checked={!autoStep}
                              onChange={() => handleAutoModeChange('none')}
                            />
                            <div className="radio-icon"></div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Manual Navigation</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Navigate layers manually with buttons or arrow keys</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                          <div className="custom-radio">
                            <input
                              type="radio"
                              name="simulationMode"
                              checked={autoStep}
                              onChange={() => handleAutoModeChange('step')}
                            />
                            <div className="radio-icon"></div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Auto-Step Mode</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Automatically advance through layers</div>
                          </div>
                        </label>
                        
                        {/* Auto-scroll option hidden
                        <label className="flex items-center p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                          <div className="custom-radio">
                            <input
                              type="radio"
                              name="simulationMode"
                              checked={false}
                              onChange={() => handleAutoModeChange('scroll')}
                            />
                            <div className="radio-icon"></div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Auto-Scroll Mode</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Show all layers expanded and auto-scroll through them</div>
                          </div>
                        </label>
                        */}
                      </div>
                    </div>
                    
                    {autoStep && (
                      <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-900 dark:text-white">
                            Step Delay
                          </label>
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-md">
                            {stepDelay / 1000}s
                          </span>
                        </div>
                        <div className="relative mt-6 mb-6">
                          <div className="slider-track" style={{ top: "50%" }}>
                            <div className="slider-track-inner"></div>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="5000"
                            step="500"
                            value={stepDelay}
                            onChange={handleSpeedChange}
                            className="custom-slider"
                            style={{
                              WebkitAppearance: 'none',
                              appearance: 'none'
                            }}
                            aria-label="Step delay adjustment"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Fast
                          </span>
                          <span className="flex items-center">
                            Slow
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Transmission Media */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transmission Medium</h3>
                  
                  <div className="space-y-3">
                    {transmissionMediaTypes.map((media) => (
                      <label key={media.id} className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group">
                        <div className="custom-radio">
                          <input
                            type="radio"
                            name="transmissionMedia"
                            value={media.id}
                            checked={selectedMedia === media.id}
                            onChange={(e) => setSelectedMedia(e.target.value)}
                          />
                          <div className="radio-icon"></div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{media.name}</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{media.speed}</div>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{media.description}</div>
                          <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Range: {media.range}</span>
                            <span>Reliability: {media.reliability}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <div className="flex flex-col md:flex-row items-center">
                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl btn-hover-effect"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8V4a2 2 0 012-2h8a2 2 0 012 2v2m-6 12V8a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2z"></path>
                    </svg>
                    Start OSI Simulation
                  </button>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-3 md:mt-0 md:ml-4 flex items-center">
                    <span className="inline-flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                      Use arrow keys to navigate layers
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="space-y-6" ref={simulationContainerRef}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                {simulationDirection === "sending" ? "Sender Side" : "Receiver Side"}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {simulationDirection === "sending" 
                    ? "Data moving down through OSI layers" 
                    : "Data moving up through OSI layers"}
                </span>
              </h2>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Currently processing at <strong>{getCurrentLayerName()} Layer</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Use ← → arrow keys to navigate or control buttons below
              </p>
            </div>
            <div className="flex space-x-2">
              {showRestartButton && (
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 bg-green-600 text-white rounded-md focus-ring btn-hover-effect animate-pulse"
                >
                  Restart Simulation
                </button>
              )}
              
              {autoStep && !showRestartButton && (
                <button
                  onClick={togglePause}
                  className={`px-4 py-2 ${
                    isPaused 
                      ? "bg-green-600" 
                      : "bg-yellow-600"
                  } text-white rounded-md focus-ring btn-hover-effect`}
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              )}
              
              <button
                onClick={handlePreviousStep}
                className="px-4 py-2 bg-gray-600 text-white rounded-md focus-ring btn-hover-effect"
                disabled={autoStep && !isPaused}
              >
                ← Previous
              </button>
              
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-md focus-ring btn-hover-effect"
                disabled={autoStep && !isPaused}
              >
                Next →
              </button>
              
              <button
                onClick={resetSimulation}
                className="px-4 py-2 bg-red-600 text-white rounded-md focus-ring btn-hover-effect"
              >
                Reset
              </button>
              
              <button
                onClick={() => setShowDetailedView(!showDetailedView)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md focus-ring btn-hover-effect"
              >
                {showDetailedView ? "Simple View" : "Detailed View"}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Original Message</h3>
              <div className="text-sm bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                Transmission Medium: <span className="font-medium">{getSelectedMediaDetails()?.name}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 p-3 rounded border mt-2">
              <p className="font-mono">{simulationData?.originalMessage}</p>
            </div>
          </div>

          {renderConnectionSetup()}

          {showTransmissionAnimation && (
            <TransmissionMedia 
              mediaType={selectedMedia} 
              binaryData={getPhysicalLayerBinaryData()}
            />
          )}

          <div className="flex items-center justify-center mb-4">
            <div className="w-1/3 h-1 bg-blue-200 dark:bg-blue-800 rounded-l-full"></div>
            <div className="px-4 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
              Step {getCurrentStepNumber()} of {osiLayers.length * 2} (Continuous Loop)
            </div>
            <div className="w-1/3 h-1 bg-blue-200 dark:bg-blue-800 rounded-r-full"></div>
          </div>

          <div className="space-y-4">
            {osiLayers.map((layer) => {
              const isActive = (
                simulationDirection === "sending" 
                  ? layer.id >= 7 - simulationStep 
                  : layer.id <= 7 - simulationStep
              );
              
              return (
                <OSILayer
                  key={layer.id}
                  layer={layer}
                  active={isActive}
                  currentStep={simulationStep}
                  direction={simulationDirection}
                  data={simulationData}
                  showDetailedView={showDetailedView}
                  mediaType={selectedMedia}
                  id={`osi-layer-${layer.id}`}
                />
              );
            })}
          </div>
          
          {showContinueButton && (
            <div className="flex justify-center mt-8 mb-4">
              <button
                onClick={handleContinue}
                className="px-8 py-3 bg-green-600 text-white text-lg font-medium rounded-lg shadow-lg hover:shadow-xl focus-ring btn-hover-effect animate-pulse"
              >
                Continue to Receiver Side
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 