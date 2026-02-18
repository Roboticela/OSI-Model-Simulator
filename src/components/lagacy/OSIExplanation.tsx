import React, { useState } from "react";

interface OSIExplanationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OSIExplanation({ isOpen, onClose }: OSIExplanationProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">OSI Model Explained</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium ${
              activeTab === "overview" 
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" 
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("layers")}
            className={`px-4 py-2 font-medium ${
              activeTab === "layers" 
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" 
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Layers
          </button>
          <button 
            onClick={() => setActiveTab("encapsulation")}
            className={`px-4 py-2 font-medium ${
              activeTab === "encapsulation" 
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" 
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Encapsulation
          </button>
          <button 
            onClick={() => setActiveTab("protocols")}
            className={`px-4 py-2 font-medium ${
              activeTab === "protocols" 
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400" 
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            Protocols
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What is the OSI Model?</h3>
              <p>
                The Open Systems Interconnection (OSI) model is a conceptual framework used to understand and standardize the functions of a telecommunication or computing system without regard to its underlying internal structure and technology.
              </p>
              <p>
                Created in the late 1970s by the International Organization for Standardization (ISO), the OSI model divides network communication into seven distinct layers, each with specific functions and responsibilities.
              </p>
              
              <h3 className="text-lg font-semibold mt-6">Why is the OSI Model Important?</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Standardization:</strong> Provides a standard for different computer systems to be able to communicate with each other.
                </li>
                <li>
                  <strong>Modular Engineering:</strong> Breaks network communication into smaller, more manageable components.
                </li>
                <li>
                  <strong>Troubleshooting:</strong> Makes it easier to isolate and fix networking problems.
                </li>
                <li>
                  <strong>Teaching Tool:</strong> Helps in understanding complex network operations.
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6">OSI vs. TCP/IP Model</h3>
              <p>
                While the OSI model is theoretical, the TCP/IP model is the practical implementation used in today&apos;s internet. TCP/IP consolidates several OSI layers:
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="border rounded p-3">
                  <h4 className="font-medium mb-2">OSI Model (7 Layers)</h4>
                  <ol className="list-decimal pl-5">
                    <li>Physical</li>
                    <li>Data Link</li>
                    <li>Network</li>
                    <li>Transport</li>
                    <li>Session</li>
                    <li>Presentation</li>
                    <li>Application</li>
                  </ol>
                </div>
                <div className="border rounded p-3">
                  <h4 className="font-medium mb-2">TCP/IP Model (4 Layers)</h4>
                  <ol className="list-decimal pl-5">
                    <li>Network Interface (≈ Physical + Data Link)</li>
                    <li>Internet (≈ Network)</li>
                    <li>Transport (≈ Transport)</li>
                    <li>Application (≈ Session + Presentation + Application)</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === "layers" && (
            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="text-lg font-semibold">Layer 7: Application</h3>
                <p className="mt-1">The interface between the user&apos;s application and the network.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Functions:</strong> High-level APIs, resource sharing, remote file access</li>
                  <li><strong>Protocols:</strong> HTTP, SMTP, FTP, DNS, DHCP, Telnet</li>
                  <li><strong>Data Unit:</strong> Data</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-indigo-500 pl-4 py-2">
                <h3 className="text-lg font-semibold">Layer 6: Presentation</h3>
                <p className="mt-1">Translates data between the application layer and the network format.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Functions:</strong> Data translation, encryption/decryption, compression</li>
                  <li><strong>Protocols:</strong> SSL/TLS, MIME, XDR, ASCII, EBCDIC</li>
                  <li><strong>Data Unit:</strong> Data</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="text-lg font-semibold">Layer 5: Session</h3>
                <p className="mt-1">Manages sessions between applications.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Functions:</strong> Session establishment, maintenance, termination, synchronization</li>
                  <li><strong>Protocols:</strong> NetBIOS, RPC, PPTP, SDP</li>
                  <li><strong>Data Unit:</strong> Data</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="text-lg font-semibold">Layer 4: Transport</h3>
                <p className="mt-1">Provides end-to-end communication control.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Functions:</strong> Segmentation, flow control, error control, connection-oriented/connectionless communication</li>
                  <li><strong>Protocols:</strong> TCP, UDP, SCTP, DCCP</li>
                  <li><strong>Data Unit:</strong> Segments (TCP) / Datagrams (UDP)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <h3 className="text-lg font-semibold">Layer 3: Network</h3>
                <p className="mt-1">Handles packet routing and logical addressing.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Functions:</strong> Logical addressing, routing, path determination, packet switching</li>
                  <li><strong>Protocols:</strong> IP, ICMP, OSPF, BGP, RIP</li>
                  <li><strong>Data Unit:</strong> Packets</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <h3 className="text-lg font-semibold">Layer 2: Data Link</h3>
                <p className="mt-1">Provides node-to-node data transfer and error detection.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Functions:</strong> Physical addressing (MAC), error detection, media access control</li>
                  <li><strong>Protocols:</strong> Ethernet, PPP, HDLC, Frame Relay, ATM</li>
                  <li><strong>Data Unit:</strong> Frames</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4 py-2">
                <h3 className="text-lg font-semibold">Layer 1: Physical</h3>
                <p className="mt-1">Transmits raw bit stream over physical medium.</p>
                <ul className="list-disc pl-5 mt-2">
                  <li><strong>Functions:</strong> Bit transmission, physical medium specification, encoding/decoding</li>
                  <li><strong>Protocols:</strong> Ethernet physical layer, USB, Bluetooth, Wi-Fi, DSL</li>
                  <li><strong>Data Unit:</strong> Bits</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === "encapsulation" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Data Encapsulation Process</h3>
              <p>
                Data encapsulation is the process where each OSI layer adds its own information to the data received from the layer above before passing it to the layer below.
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="border rounded p-4 bg-purple-50 dark:bg-purple-900/20">
                  <h4 className="font-medium">Step 1: Application Layer (Layer 7)</h4>
                  <p>User data is generated and passed to the Presentation layer.</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-sm">User Data</code>
                  </div>
                </div>
                
                <div className="border rounded p-4 bg-indigo-50 dark:bg-indigo-900/20">
                  <h4 className="font-medium">Step 2: Presentation Layer (Layer 6)</h4>
                  <p>Data is translated, possibly encrypted or compressed.</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-sm">Translated/Encrypted Data</code>
                  </div>
                </div>
                
                <div className="border rounded p-4 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-medium">Step 3: Session Layer (Layer 5)</h4>
                  <p>Session information is added.</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-sm">Session Header + Data</code>
                  </div>
                </div>
                
                <div className="border rounded p-4 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-medium">Step 4: Transport Layer (Layer 4)</h4>
                  <p>Segments data and adds transport headers (e.g., TCP/UDP).</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-sm">TCP/UDP Header + Data = Segment</code>
                  </div>
                </div>
                
                <div className="border rounded p-4 bg-yellow-50 dark:bg-yellow-900/20">
                  <h4 className="font-medium">Step 5: Network Layer (Layer 3)</h4>
                  <p>Adds IP headers with source and destination addresses.</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-sm">IP Header + Segment = Packet</code>
                  </div>
                </div>
                
                <div className="border rounded p-4 bg-orange-50 dark:bg-orange-900/20">
                  <h4 className="font-medium">Step 6: Data Link Layer (Layer 2)</h4>
                  <p>Adds MAC addresses and creates frames.</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-sm">MAC Header + Packet + FCS = Frame</code>
                  </div>
                </div>
                
                <div className="border rounded p-4 bg-red-50 dark:bg-red-900/20">
                  <h4 className="font-medium">Step 7: Physical Layer (Layer 1)</h4>
                  <p>Converts frames to bits for transmission.</p>
                  <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border">
                    <code className="text-sm">01010101010101010101010101...</code>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Data Decapsulation</h3>
              <p>
                At the receiving end, the process is reversed (decapsulation). Each layer strips off its respective headers/trailers and passes the data up to the next layer.
              </p>
            </div>
          )}
          
          {activeTab === "protocols" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Common Protocols by OSI Layer</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layer</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Protocols</th>
                      <th className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">7. Application</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium mr-1">HTTP/HTTPS</span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium mr-1">FTP</span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium mr-1">SMTP</span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs font-medium">DNS</span>
                      </td>
                      <td className="px-6 py-4 text-sm">Protocols that applications use to communicate over a network</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">6. Presentation</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium mr-1">SSL/TLS</span>
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium mr-1">MIME</span>
                        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-xs font-medium">JPEG/GIF</span>
                      </td>
                      <td className="px-6 py-4 text-sm">Protocols for data translation, encryption, and compression</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">5. Session</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium mr-1">NetBIOS</span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium mr-1">RPC</span>
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">PPTP</span>
                      </td>
                      <td className="px-6 py-4 text-sm">Protocols for session establishment and management</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">4. Transport</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium mr-1">TCP</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium mr-1">UDP</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs font-medium">SCTP</span>
                      </td>
                      <td className="px-6 py-4 text-sm">Protocols for reliable data transfer and flow control</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">3. Network</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium mr-1">IP</span>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium mr-1">ICMP</span>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs font-medium">OSPF</span>
                      </td>
                      <td className="px-6 py-4 text-sm">Protocols for packet routing and logical addressing</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">2. Data Link</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded text-xs font-medium mr-1">Ethernet</span>
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded text-xs font-medium mr-1">PPP</span>
                        <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded text-xs font-medium">HDLC</span>
                      </td>
                      <td className="px-6 py-4 text-sm">Protocols for physical addressing and media access control</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">1. Physical</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs font-medium mr-1">Ethernet</span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs font-medium mr-1">USB</span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded text-xs font-medium">Bluetooth</span>
                      </td>
                      <td className="px-6 py-4 text-sm">Standards for physical media, connectors, and signaling</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h3 className="text-lg font-semibold mt-6">Key Protocol Interactions</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>HTTP & TCP:</strong> HTTP (Layer 7) relies on TCP (Layer 4) for reliable data delivery.
                </li>
                <li>
                  <strong>DNS & UDP:</strong> DNS lookups (Layer 7) typically use UDP (Layer 4) for faster, connectionless queries.
                </li>
                <li>
                  <strong>TCP & IP:</strong> TCP (Layer 4) segments are encapsulated in IP (Layer 3) packets.
                </li>
                <li>
                  <strong>IP & Ethernet:</strong> IP packets (Layer 3) are encapsulated in Ethernet frames (Layer 2).
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 