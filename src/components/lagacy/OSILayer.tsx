"use client";

import { useRef, useEffect } from "react";
import { getLayerData } from "../../utils/lagacy/osiUtils";

interface OSILayerProps {
  layer: {
    id: number;
    name: string;
    description: string;
    color: string;
    borderColor: string;
  };
  active: boolean;
  currentStep: number;
  direction: "sending" | "receiving";
  data: {
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
  } | null;
  showDetailedView: boolean;
  mediaType?: string;
  id: string;
}

export default function OSILayer({ layer, active, currentStep, direction, data, showDetailedView, mediaType = "cable", id }: OSILayerProps) {
  const layerData = data ? getLayerData(data, layer.id, direction) : null;
  const isCurrentLayer = 
    (direction === "sending" && layer.id === 7 - currentStep) || 
    (direction === "receiving" && layer.id === 7 - currentStep);
    
  const layerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
  }, [isCurrentLayer, currentStep, direction]);

  const getLayerIcon = () => {
    switch (layer.id) {
      case 7: return "📱"; 
      case 6: return "🔄"; 
      case 5: return "🔗"; 
      case 4: return "🚚"; 
      case 3: return "🌐"; 
      case 2: return "🔍"; 
      case 1: return "⚡"; 
      default: return "📋";
    }
  };

  const getMediaIcon = () => {
    if (layer.id !== 1) return null;
    
    switch (mediaType) {
      case "cable": return "🔌"; 
      case "fiber": return "💡"; 
      case "wireless": return "📶"; 
      default: return "⚡"; 
    }
  };

  const renderSignalPattern = () => {
    if (layer.id !== 1 || !layerData?.signalPattern) return null;
    
    return (
      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border mt-3">
        <h4 className="text-sm font-medium mb-2">Signal Pattern</h4>
        <div className="font-mono text-lg leading-tight overflow-x-auto whitespace-nowrap p-2 bg-white dark:bg-gray-800 rounded">
          {layerData.signalPattern}
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {mediaType === "cable" 
            ? "Electrical signals (▄ = high voltage, ▁ = low voltage)" 
            : mediaType === "fiber" 
            ? "Light pulses (● = bright, ○ = dim)" 
            : "Radio waves (〰️ = strong signal, 〜 = weak signal)"}
        </p>
      </div>
    );
  };

  const renderHandshake = () => {
    if (layer.id !== 4 || direction !== "sending" || !layerData?.handshakeData) return null;
    
    return (
      <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
        <h4 className="text-sm font-medium mb-1">TCP Three-Way Handshake</h4>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="text-center">Sender</div>
          <div className="text-center">Receiver</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-5/12 text-right text-xs">{layerData.handshakeData.syn}</div>
            <div className="w-2/12 flex justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-blue-500 border-b-8 border-b-transparent"></div>
              <div className="flex-1 h-0.5 bg-blue-500"></div>
            </div>
            <div className="w-5/12 text-xs">Step 1: SYN</div>
          </div>
          <div className="flex items-center">
            <div className="w-5/12 text-right text-xs">{layerData.handshakeData.synAck}</div>
            <div className="w-2/12 flex justify-center">
              <div className="flex-1 h-0.5 bg-green-500"></div>
              <div className="w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-green-500 border-b-8 border-b-transparent"></div>
            </div>
            <div className="w-5/12 text-xs">Step 2: SYN-ACK</div>
          </div>
          <div className="flex items-center">
            <div className="w-5/12 text-right text-xs">{layerData.handshakeData.ack}</div>
            <div className="w-2/12 flex justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-blue-500 border-b-8 border-b-transparent"></div>
              <div className="flex-1 h-0.5 bg-blue-500"></div>
            </div>
            <div className="w-5/12 text-xs">Step 3: ACK</div>
          </div>
        </div>
        <p className="text-xs mt-3">Connection established! Data transfer can begin.</p>
      </div>
    );
  };

  const renderSimpleView = () => {
    if (!active || !layerData) return null;
    
    return (
      <div className="p-2">
        {isCurrentLayer && (
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800 mb-2">
            <h4 className="text-sm font-medium mb-1">Current Action:</h4>
            <p className="text-sm">
              {direction === "sending" 
                ? `Adding ${layer.name} layer information` 
                : `Processing ${layer.name} layer information`}
            </p>
            {layerData.addedData && direction === "sending" && (
              <div className="mt-2">
                <h5 className="text-xs font-medium">Added Information:</h5>
                <p className="text-xs bg-blue-50 dark:bg-blue-900/20 p-1 rounded mt-1">{layerData.addedData}</p>
              </div>
            )}
            {layer.id === 1 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium">Transmission Medium:</h5>
                <p className="text-xs bg-blue-50 dark:bg-blue-900/20 p-1 rounded mt-1 flex items-center gap-1">
                  <span>{getMediaIcon()}</span>
                  <span>{mediaType === "cable" ? "Copper Cable" : mediaType === "fiber" ? "Optical Fiber" : "Wireless"}</span>
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm">
          <span>{direction === "sending" ? "↓" : "↑"}</span>
          <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded overflow-x-auto max-w-full">
            {layerData.finalData || layerData.data}
          </span>
        </div>

        {layer.id === 1 && layerData.signalPattern && (
          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
            <h5 className="text-xs font-medium mb-1">Signal Pattern:</h5>
            <div className="font-mono text-sm overflow-x-auto whitespace-nowrap">
              {layerData.signalPattern}
            </div>
          </div>
        )}

        {layer.id === 4 && direction === "sending" && isCurrentLayer && layerData.handshakeData && (
          <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded border">
            <h5 className="text-xs font-medium mb-1">TCP Handshake:</h5>
            <p className="text-xs">SYN → SYN-ACK → ACK</p>
          </div>
        )}
      </div>
    );
  };

  const renderDetailedView = () => {
    if (!active || !layerData) return null;
    
    return (
      <div className="space-y-3">
        {layerData.rawData && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded border">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <span>Input Data</span>
            </h4>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all bg-gray-50 dark:bg-gray-900 p-2 rounded">
              {layerData.rawData}
            </pre>
          </div>
        )}
        
        {layerData.addedData && direction === "sending" && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <span>Information Added at This Layer ➕</span>
            </h4>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all bg-white dark:bg-gray-900 p-2 rounded">
              {layerData.addedData}
            </pre>
          </div>
        )}
        
        {layerData.finalData && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <span>Final Data After Processing ✅</span>
            </h4>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all bg-white dark:bg-gray-900 p-2 rounded">
              {layerData.finalData}
            </pre>
          </div>
        )}
        
        {layerData.headers && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded border">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <span>Headers/Trailers 📝</span>
            </h4>
            <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all bg-gray-50 dark:bg-gray-900 p-2 rounded">
              {layerData.headers}
            </pre>
          </div>
        )}
        
        {isCurrentLayer && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-800">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <span>Current Processing ⚙️</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {layerData.processes.map((process: string, idx: number) => (
                <li key={idx}>{process}</li>
              ))}
            </ul>
          </div>
        )}
        
        {layer.id === 1 && isCurrentLayer && (
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-200 dark:border-indigo-800">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <span>{getMediaIcon()} Transmission Medium</span>
            </h4>
            <div className="space-y-2">
              <p className="text-sm">
                {mediaType === "cable" 
                  ? "Using copper cable with electrical signals" 
                  : mediaType === "fiber" 
                  ? "Using optical fiber with light pulses" 
                  : "Using wireless radio waves through air"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Speed:</span>
                <span className="text-xs">
                  {mediaType === "cable" 
                    ? "1 Gbps" 
                    : mediaType === "fiber" 
                    ? "10+ Gbps" 
                    : "450+ Mbps"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Signal Quality:</span>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className={`h-full rounded-full ${
                    mediaType === "fiber" 
                      ? "w-[95%] bg-green-500" 
                      : mediaType === "cable" 
                      ? "w-[80%] bg-green-500" 
                      : "w-[60%] bg-yellow-500"
                  }`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Render signal pattern for physical layer */}
        {layer.id === 1 && renderSignalPattern()}
        
        {layerData.protocols && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded border">
            <h4 className="text-sm font-medium mb-1 flex items-center gap-2">
              <span>Protocols 📋</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {layerData.protocols.split(", ").map((protocol: string, idx: number) => (
                <span 
                  key={idx} 
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                >
                  {protocol}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Render TCP handshake visualization */}
        {isCurrentLayer && direction === "sending" && layer.id === 4 && renderHandshake()}

        {isCurrentLayer && direction === "sending" && layer.id === 3 && (
          <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
            <h4 className="text-sm font-medium mb-1">Routing Visualization</h4>
            <div className="flex justify-between items-center my-2 text-xs">
              <div className="text-center">Source<br/>192.168.1.10</div>
              <div className="text-center">Router 1<br/>192.168.1.1</div>
              <div className="text-center">Router 2<br/>10.0.0.1</div>
              <div className="text-center">Destination<br/>10.0.0.5</div>
            </div>
            <div className="relative h-6 w-full bg-gray-100 dark:bg-gray-700 rounded-full my-2">
              <div className="absolute left-0 top-0 h-6 w-6 rounded-full bg-blue-500 animate-pulse"></div>
              <div className="absolute left-1/3 top-0 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="absolute left-2/3 top-0 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="absolute right-0 top-0 h-6 w-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-400"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
          <div
        ref={layerRef}
        id={id}
        className={`p-4 border-2 rounded-md transition-all duration-300 ${
          layer.color
        } ${layer.borderColor} ${
          isCurrentLayer ? "ring-2 ring-blue-500 shadow-lg layer-highlight" : ""
        } ${active ? "opacity-100" : "opacity-50"}`}
      >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-xl">{layer.id === 1 ? getMediaIcon() : getLayerIcon()}</span>
          Layer {layer.id}: {layer.name}
        </h3>
        {isCurrentLayer && (
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
            Current Step
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{layer.description}</p>
      
      {active && layerData && (
        showDetailedView ? renderDetailedView() : renderSimpleView()
      )}
    </div>
  );
} 