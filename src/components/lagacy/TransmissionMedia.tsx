"use client";

import React, { useState, useEffect } from "react";

interface TransmissionMediaProps {
  mediaType: string;
  binaryData?: string;
}

export default function TransmissionMedia({ mediaType, binaryData }: TransmissionMediaProps) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const duration = mediaType === "fiber" ? 1000 : mediaType === "wireless" ? 3000 : 2000;
    const interval = 50; 
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setProgress(Math.min(100, (currentStep / steps) * 100));
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [mediaType]);
  
  const renderBinaryVisualization = () => {
    if (!binaryData) return null;
    
    const fullData = binaryData.replace(/\s/g, '');
    
    const visualSample = fullData.length > 100 ? fullData.substring(0, 100) : fullData;
    
    const renderVisualBits = () => {
      switch (mediaType) {
        case "cable":
          return (
            <div className="flex items-center h-6 space-x-1 overflow-x-auto whitespace-nowrap">
              {visualSample.split('').map((bit, idx) => (
                <div 
                  key={idx} 
                  className={`h-full w-2 ${bit === '1' ? 'bg-yellow-400' : 'bg-gray-300'}`}
                  style={{ 
                    animationDelay: `${idx * 0.05}s`,
                    opacity: idx < progress / (100 / visualSample.length) ? 1 : 0.2
                  }}
                ></div>
              ))}
            </div>
          );
          
        case "fiber":
          return (
            <div className="flex items-center h-6 space-x-1 overflow-x-auto whitespace-nowrap">
              {visualSample.split('').map((bit, idx) => (
                <div 
                  key={idx} 
                  className={`h-4 w-4 rounded-full ${bit === '1' ? 'bg-cyan-400' : 'bg-blue-200'} ${bit === '1' ? 'animate-pulse-fast' : ''}`}
                  style={{ 
                    animationDelay: `${idx * 0.03}s`,
                    opacity: idx < progress / (100 / visualSample.length) ? 1 : 0.2
                  }}
                ></div>
              ))}
            </div>
          );
          
        case "wireless":
          return (
            <div className="flex items-center h-12 space-x-2 overflow-x-auto whitespace-nowrap">
              {visualSample.split('').map((bit, idx) => (
                <div 
                  key={idx} 
                  className="relative"
                  style={{ 
                    opacity: idx < progress / (100 / visualSample.length) ? 1 : 0.2
                  }}
                >
                  {bit === '1' ? (
                    <div className="w-6 h-6 border-2 border-purple-500 dark:border-purple-400 rounded-full animate-wave"></div>
                  ) : (
                    <div className="w-4 h-4 border border-purple-300 dark:border-purple-600 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          );
          
        default:
          return null;
      }
    };
    
    return (
      <div className="space-y-4">
        {renderVisualBits()}
        
        {/* Show full binary data as text */}
        <div className="mt-4">
          <h5 className="text-xs font-medium mb-1">Complete Binary Data:</h5>
          <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded border max-h-32 overflow-y-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap break-all">{binaryData}</pre>
          </div>
        </div>
      </div>
    );
  };

  const renderMediaVisualization = () => {
    switch (mediaType) {
      case "cable":
        return (
          <div className="p-8 border rounded-md bg-blue-50 dark:bg-blue-900/30 mb-6">
            <h3 className="text-lg font-medium mb-4">Transmitting Data via Copper Cable...</h3>
            <div className="relative h-16 flex items-center justify-center">
              {/* Cable visualization */}
              <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded-full relative overflow-hidden">
                {/* Cable sheath */}
                <div className="absolute inset-0 border-2 border-gray-400 dark:border-gray-600 rounded-full"></div>
                {/* Electrical signal pulses */}
                <div className="absolute left-0 top-0 h-full w-8 bg-yellow-400 dark:bg-yellow-600 animate-pulse-fast"></div>
                <div className="absolute left-[20%] top-0 h-full w-8 bg-yellow-400 dark:bg-yellow-600 animate-pulse-fast" style={{ animationDelay: "0.2s" }}></div>
                <div className="absolute left-[40%] top-0 h-full w-8 bg-yellow-400 dark:bg-yellow-600 animate-pulse-fast" style={{ animationDelay: "0.4s" }}></div>
                <div className="absolute left-[60%] top-0 h-full w-8 bg-yellow-400 dark:bg-yellow-600 animate-pulse-fast" style={{ animationDelay: "0.6s" }}></div>
                <div className="absolute left-[80%] top-0 h-full w-8 bg-yellow-400 dark:bg-yellow-600 animate-pulse-fast" style={{ animationDelay: "0.8s" }}></div>
              </div>
              {/* Progress indicator */}
              <div className="absolute -bottom-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            
            {/* Binary data visualization */}
            <div className="mt-8">
              <h4 className="text-sm font-medium mb-2">Binary Data Transmission</h4>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                {renderBinaryVisualization()}
              </div>
            </div>
            
            <div className="flex justify-between mt-4 text-sm">
              <div>Sender</div>
              <div>Receiver</div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium">Copper Cable Transmission</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Data is transmitted as electrical signals through copper wires. The signal strength decreases over distance (attenuation).
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium">Signal Quality:</span>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="w-[80%] h-full bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs">Good</span>
              </div>
            </div>
          </div>
        );
        
      case "fiber":
        return (
          <div className="p-8 border rounded-md bg-indigo-50 dark:bg-indigo-900/30 mb-6">
            <h3 className="text-lg font-medium mb-4">Transmitting Data via Optical Fiber...</h3>
            <div className="relative h-16 flex items-center justify-center">
              {/* Fiber visualization */}
              <div className="w-full h-3 bg-blue-100 dark:bg-blue-900 rounded-full relative overflow-hidden">
                {/* Fiber cladding */}
                <div className="absolute inset-0 border border-blue-300 dark:border-blue-700 rounded-full"></div>
                {/* Light pulses */}
                <div className="absolute left-0 top-0 h-full w-6 bg-cyan-400 dark:bg-cyan-500 rounded-full blur-sm animate-light-pulse"></div>
                <div className="absolute left-[15%] top-0 h-full w-6 bg-cyan-400 dark:bg-cyan-500 rounded-full blur-sm animate-light-pulse" style={{ animationDelay: "0.1s" }}></div>
                <div className="absolute left-[30%] top-0 h-full w-6 bg-cyan-400 dark:bg-cyan-500 rounded-full blur-sm animate-light-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="absolute left-[45%] top-0 h-full w-6 bg-cyan-400 dark:bg-cyan-500 rounded-full blur-sm animate-light-pulse" style={{ animationDelay: "0.3s" }}></div>
                <div className="absolute left-[60%] top-0 h-full w-6 bg-cyan-400 dark:bg-cyan-500 rounded-full blur-sm animate-light-pulse" style={{ animationDelay: "0.4s" }}></div>
                <div className="absolute left-[75%] top-0 h-full w-6 bg-cyan-400 dark:bg-cyan-500 rounded-full blur-sm animate-light-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div className="absolute left-[90%] top-0 h-full w-6 bg-cyan-400 dark:bg-cyan-500 rounded-full blur-sm animate-light-pulse" style={{ animationDelay: "0.6s" }}></div>
              </div>
              {/* Progress indicator */}
              <div className="absolute -bottom-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            
            {/* Binary data visualization */}
            <div className="mt-8">
              <h4 className="text-sm font-medium mb-2">Light Pulse Data Transmission</h4>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                {renderBinaryVisualization()}
              </div>
            </div>
            
            <div className="flex justify-between mt-4 text-sm">
              <div>Sender</div>
              <div>Receiver</div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium">Optical Fiber Transmission</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Data is transmitted as light pulses through glass or plastic fibers. This allows for very high speeds and low signal loss over long distances.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium">Signal Quality:</span>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="w-[95%] h-full bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs">Excellent</span>
              </div>
            </div>
          </div>
        );
        
      case "wireless":
        return (
          <div className="p-8 border rounded-md bg-purple-50 dark:bg-purple-900/30 mb-6">
            <h3 className="text-lg font-medium mb-4">Transmitting Data via Wireless...</h3>
            <div className="relative h-24 flex items-center justify-center">
              {/* Wireless visualization */}
              <div className="flex items-center justify-between w-full">
                {/* Sender */}
                <div className="relative">
                  <div className="w-8 h-12 bg-gray-400 dark:bg-gray-600 rounded"></div>
                  {/* Radio waves */}
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 border-2 border-purple-500 dark:border-purple-400 rounded-full opacity-0 animate-wave"></div>
                    <div className="w-12 h-12 border-2 border-purple-500 dark:border-purple-400 rounded-full opacity-0 animate-wave" style={{ animationDelay: "0.5s" }}></div>
                    <div className="w-18 h-18 border-2 border-purple-500 dark:border-purple-400 rounded-full opacity-0 animate-wave" style={{ animationDelay: "1s" }}></div>
                  </div>
                </div>
                
                {/* Signal path with interference */}
                <div className="flex-1 h-1 mx-4 bg-gray-200 dark:bg-gray-700 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 animate-pulse-slow opacity-70" style={{ width: `${progress}%` }}></div>
                  {/* Interference */}
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-4 h-4 bg-red-400 dark:bg-red-600 rounded-full opacity-50 animate-interference"></div>
                  <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-3 h-3 bg-red-400 dark:bg-red-600 rounded-full opacity-50 animate-interference" style={{ animationDelay: "1.2s" }}></div>
                </div>
                
                {/* Receiver */}
                <div className="w-8 h-12 bg-gray-400 dark:bg-gray-600 rounded"></div>
              </div>
              
              {/* Progress indicator */}
              <div className="absolute -bottom-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            
            {/* Binary data visualization */}
            <div className="mt-8">
              <h4 className="text-sm font-medium mb-2">Radio Wave Data Transmission</h4>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                {renderBinaryVisualization()}
              </div>
            </div>
            
            <div className="flex justify-between mt-4 text-sm">
              <div>Sender</div>
              <div>Receiver</div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium">Wireless Transmission</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Data is transmitted as radio waves through the air. Subject to interference and signal degradation over distance.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-medium">Signal Quality:</span>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="w-[60%] h-full bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-xs">Moderate</span>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-8 border rounded-md bg-blue-50 dark:bg-blue-900/30 mb-6 text-center">
            <h3 className="text-lg font-medium mb-4">Transmitting Data...</h3>
            <div className="flex justify-center items-center space-x-4">
              <div className="text-right font-medium">Sender</div>
              <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full relative">
                <div className="absolute left-0 top-0 h-2 bg-blue-500 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="text-left font-medium">Receiver</div>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Physical transmission of bits over the network medium
            </p>
          </div>
        );
    }
  };

  return renderMediaVisualization();
} 