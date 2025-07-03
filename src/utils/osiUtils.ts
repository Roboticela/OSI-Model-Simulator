// OSI Model Utility Functions

// Interface for layer data
interface LayerData {
  data: string;
  headers?: string;
  protocols: string;
  processes: string[];
  rawData?: string; // Original data before processing
  addedData?: string; // Data added at this layer
  finalData?: string; // Final data after processing
  binaryRepresentation?: string;
  signalPattern?: string;
  handshakeData?: {
    syn: string;
    synAck: string;
    ack: string;
  };
  originalMessage?: string; // Store the original message
}

// Interface for simulation data
interface SimulationData {
  originalMessage: string;
  layers: {
    [key: number]: {
      sending: LayerData;
      receiving: LayerData;
    };
  };
}

/**
 * Process a user message through all OSI layers
 */
export function processMessage(message: string, mediaType: string = "cable"): SimulationData {
  const simulationData: SimulationData = {
    originalMessage: message,
    layers: {}
  };

  // Initialize all layers with processed data flowing through each layer
  let processedData = message;
  
  // Sending direction - data flows down through layers 7 to 1
  for (let i = 7; i >= 1; i--) {
    const layerData = generateLayerData(processedData, i, "sending", mediaType, message);
    simulationData.layers[i] = {
      sending: layerData,
      receiving: {} as LayerData // Will be filled later
    };
    
    // Update processed data for next layer
    processedData = layerData.finalData || processedData;
  }
  
  // Store the final binary representation for physical transmission
  const binaryTransmission = processedData;
  
  // For receiving, we'll use the original message directly
  // This ensures the data is properly preserved through all layers
  for (let i = 1; i <= 7; i++) {
    // Generate receiving data that preserves the original message
    const layerData = generateReceivingLayerData(i, mediaType, message, binaryTransmission);
    simulationData.layers[i].receiving = layerData;
  }
  
  return simulationData;
}

/**
 * Get data for a specific layer
 */
export function getLayerData(
  data: SimulationData,
  layerId: number,
  direction: "sending" | "receiving"
): LayerData {
  return data.layers[layerId][direction];
}

/**
 * Convert string to binary representation
 */
function stringToBinary(str: string): string {
  return str.split('').map(char => {
    const binary = char.charCodeAt(0).toString(2);
    // Pad with zeros to ensure 8 bits per character
    return '0'.repeat(8 - binary.length) + binary;
  }).join(' ');
}

/**
 * Generate data for each layer based on the message
 */
function generateLayerData(
  message: string,
  layerId: number,
  direction: "sending" | "receiving",
  mediaType: string = "cable",
  originalMessage?: string
): LayerData {
  // Default layer data
  const layerData: LayerData = {
    data: message,
    protocols: "",
    processes: [],
    rawData: message,
    addedData: "",
    finalData: "",
    originalMessage: originalMessage // Store the original message
  };
  
  // For receiving direction in layers 2-6, preserve the original message in finalData
  if (direction === "receiving" && layerId > 1 && layerId < 7 && originalMessage) {
    layerData.finalData = message;
  }

  // Process based on layer
  switch (layerId) {
    case 7: // Application Layer
      if (direction === "sending") {
        layerData.data = message;
        layerData.protocols = "HTTP, SMTP, FTP, DNS, DHCP";
        layerData.processes = [
          "User data is prepared for transmission",
          "Application-specific formatting is applied",
          "User authentication may occur at this layer",
          "Data is passed to the Presentation layer"
        ];
        layerData.rawData = message;
        layerData.addedData = "HTTP/1.1 Request Headers";
        layerData.finalData = `GET /resource HTTP/1.1\nHost: example.com\nUser-Agent: OSI-Simulator\nAccept: text/html\n\n${message}`;
        layerData.binaryRepresentation = "";
      } else {
        layerData.data = message;
        layerData.protocols = "HTTP, SMTP, FTP, DNS, DHCP";
        layerData.processes = [
          "Data is received from Presentation layer",
          "Application-specific processing is performed",
          "Data is presented to the user application",
          "Final data is ready for the user"
        ];
        layerData.rawData = message;
        layerData.addedData = "";
        
        // Always use the original message for the final data in the Application layer
        if (originalMessage) {
          layerData.finalData = originalMessage;
        } else {
          layerData.finalData = message;
        }
        
        layerData.binaryRepresentation = "";
      }
      break;

    case 6: // Presentation Layer
      if (direction === "sending") {
        // Simulate encoding/encryption instead of just adding text in brackets
        const encodedMessage = encodeMessage(message);
        
        layerData.data = encodedMessage;
        layerData.headers = "Content-Type: text/plain; charset=UTF-8";
        layerData.protocols = "SSL/TLS, MIME, XDR";
        layerData.processes = [
          "Character encoding translation (e.g., ASCII to EBCDIC)",
          "Data compression to reduce size",
          "Encryption for secure transmission",
          "Format conversion to standard network format"
        ];
        layerData.rawData = message;
        layerData.addedData = "Content-Type header, TLS encryption, Base64 encoding";
        layerData.finalData = `Content-Type: text/plain; charset=UTF-8\nContent-Encoding: gzip\nContent-Transfer-Encoding: base64\n\n${encodedMessage}`;
        layerData.binaryRepresentation = "";
      } else {
        // Simulate decoding/decryption
        const decodedMessage = decodeMessage(message);
        
        layerData.data = decodedMessage;
        layerData.headers = "Content-Type: text/plain; charset=UTF-8";
        layerData.protocols = "SSL/TLS, MIME, XDR";
        layerData.processes = [
          "Decryption of encrypted data",
          "Decompression of compressed data",
          "Character encoding translation to local format",
          "Conversion from network format to application format"
        ];
        layerData.rawData = message;
        layerData.addedData = "";
        layerData.finalData = decodedMessage;
        layerData.binaryRepresentation = "";
      }
      break;

    case 5: // Session Layer
      if (direction === "sending") {
        // Create a session with real session ID and parameters
        const sessionId = generateSessionId();
        const sessionData = `${message}`;
        
        layerData.data = sessionData;
        layerData.headers = `Session-ID: ${sessionId}\nDialog-Control: Half-Duplex`;
        layerData.protocols = "NetBIOS, RPC, PPTP";
        layerData.processes = [
          "Establishing a session between sender and receiver",
          "Managing session continuation through checkpoints",
          "Implementing dialog control (full/half-duplex)",
          "Adding session identifiers to track the communication"
        ];
        layerData.rawData = message;
        layerData.addedData = `Session-ID: ${sessionId}, Dialog-Control: Half-Duplex`;
        layerData.finalData = `Session-ID: ${sessionId}\nDialog-Control: Half-Duplex\nCheckpoint: 0\n\n${message}`;
        layerData.binaryRepresentation = "";
      } else {
        // Extract session data
        // Find the position of the double newline that separates headers from body
        const sessionHeaderEndIndex = message.indexOf("\n\n");
        const sessionMessage = sessionHeaderEndIndex >= 0 ? message.substring(sessionHeaderEndIndex + 2) : message;
        
        layerData.data = sessionMessage;
        layerData.headers = message.match(/Session-ID:.*?(?=\n)/)?.[0] || "Session-ID: Unknown";
        layerData.protocols = "NetBIOS, RPC, PPTP";
        layerData.processes = [
          "Verifying session identifiers",
          "Managing session synchronization",
          "Handling dialog control for data exchange",
          "Preparing to close the session when transmission completes"
        ];
        layerData.rawData = message;
        layerData.addedData = "";
        layerData.finalData = sessionMessage;
        layerData.binaryRepresentation = "";
      }
      break;

    case 4: // Transport Layer
      if (direction === "sending") {
        // Create real TCP segments with sequence numbers
        const sourcePort = 49152;
        const destPort = 80;
        const seqNumber = 1000;
        const segmentedData = segmentData(message);
        
        layerData.data = segmentedData;
        layerData.headers = `Source Port: ${sourcePort}\nDestination Port: ${destPort}\nSequence Number: ${seqNumber}\nACK Number: 0\nWindow Size: 64240`;
        layerData.protocols = "TCP, UDP, SCTP";
        layerData.processes = [
          "Segmenting data into smaller chunks",
          "Adding source and destination port numbers",
          "Implementing flow control to prevent overflow",
          "Establishing connection via three-way handshake (for TCP)",
          "Adding sequence numbers for ordered delivery"
        ];
        layerData.rawData = message;
        layerData.addedData = `TCP Header (Source Port: ${sourcePort}, Destination Port: ${destPort}, Seq: ${seqNumber})`;
        layerData.finalData = `[TCP Header]\nSource Port: ${sourcePort}\nDestination Port: ${destPort}\nSequence Number: ${seqNumber}\nACK Number: 0\nFlags: PSH, ACK\nWindow Size: 64240\nChecksum: 0x3F4D\n\n${segmentedData}`;
        layerData.binaryRepresentation = "";
        layerData.handshakeData = {
          syn: `SYN: Sequence=${seqNumber}`,
          synAck: `SYN-ACK: Sequence=2000, Acknowledgment=${seqNumber + 1}`,
          ack: `ACK: Acknowledgment=2001`
        };
      } else {
        // Reassemble TCP segments
        // Find the position of the double newline that separates headers from body
        const tcpHeaderEndIndex = message.indexOf("\n\n");
        const transportMessage = tcpHeaderEndIndex >= 0 ? message.substring(tcpHeaderEndIndex + 2) : message;
        const reassembledData = reassembleSegments(transportMessage);
        
        layerData.data = reassembledData;
        layerData.headers = "Source Port: 80\nDestination Port: 49152\nSequence Number: 2000\nACK Number: 1001\nWindow Size: 64240";
        layerData.protocols = "TCP, UDP, SCTP";
        layerData.processes = [
          "Reassembling segments into complete message",
          "Verifying sequence numbers for correct ordering",
          "Checking for missing segments and requesting retransmission",
          "Implementing error recovery if needed",
          "Passing complete data to Session layer"
        ];
        layerData.rawData = message;
        layerData.addedData = "";
        layerData.finalData = reassembledData;
        layerData.binaryRepresentation = "";
      }
      break;

    case 3: // Network Layer
      if (direction === "sending") {
        // Create IP packet with real header information
        const sourceIP = "192.168.1.10";
        const destIP = "10.0.0.5";
        const ttl = 64;
        const packetData = createPacket(message);
        
        layerData.data = packetData;
        layerData.headers = `Source IP: ${sourceIP}\nDestination IP: ${destIP}\nTTL: ${ttl}\nProtocol: TCP (6)`;
        layerData.protocols = "IP, ICMP, IGMP, ARP";
        layerData.processes = [
          "Adding source and destination IP addresses",
          "Determining optimal path for routing",
          "Fragmenting packets if necessary",
          "Setting Time-To-Live (TTL) value"
        ];
        layerData.rawData = message;
        layerData.addedData = `IP Header (Source: ${sourceIP}, Destination: ${destIP})`;
        layerData.finalData = `[IP Header]\nVersion: 4\nHeader Length: 20 bytes\nType of Service: 0x00\nTotal Length: ${message.length + 40} bytes\nIdentification: 0x1234\nFlags: 0x02 (Don't Fragment)\nFragment Offset: 0\nTTL: ${ttl}\nProtocol: TCP (6)\nHeader Checksum: 0xB861\nSource IP: ${sourceIP}\nDestination IP: ${destIP}\n\n${packetData}`;
        layerData.binaryRepresentation = "";
      } else {
        // Extract packet data
        // Find the position of the double newline that separates headers from body
        const ipHeaderEndIndex = message.indexOf("\n\n");
        const networkMessage = ipHeaderEndIndex >= 0 ? message.substring(ipHeaderEndIndex + 2) : message;
        const extractedData = extractPacketData(networkMessage);
        
        layerData.data = extractedData;
        layerData.headers = "Source IP: 10.0.0.5\nDestination IP: 192.168.1.10\nTTL: 64\nProtocol: TCP (6)";
        layerData.protocols = "IP, ICMP, IGMP, ARP";
        layerData.processes = [
          "Checking destination IP address",
          "Decrementing TTL value",
          "Reassembling fragments if necessary",
          "Routing packet to correct interface",
          "Passing packet to Transport layer"
        ];
        layerData.rawData = message;
        layerData.addedData = "";
        layerData.finalData = extractedData;
        layerData.binaryRepresentation = "";
      }
      break;

    case 2: // Data Link Layer
      if (direction === "sending") {
        // Create Ethernet frame with real MAC addresses and frame data
        const sourceMac = "00:1A:2B:3C:4D:5E";
        const destMac = "FF:FF:FF:FF:FF:FF";
        const frameData = createFrame(message);
        const crc = calculateCRC(frameData);
        
        layerData.data = frameData;
        layerData.headers = `Source MAC: ${sourceMac}\nDestination MAC: ${destMac}`;
        layerData.protocols = "Ethernet, PPP, HDLC, Frame Relay";
        layerData.processes = [
          "Adding MAC addresses (source and destination)",
          "Framing data with start/end delimiters",
          "Implementing error detection (CRC)",
          "Controlling media access (MAC protocols)"
        ];
        layerData.rawData = message;
        layerData.addedData = "Ethernet Frame Header and Trailer";
        layerData.finalData = `[Ethernet Frame]\nPreamble: 10101010 10101010 10101010 10101010 10101010 10101010 10101010\nStart Frame Delimiter: 10101011\nDestination MAC: ${destMac}\nSource MAC: ${sourceMac}\nEtherType: 0x0800 (IPv4)\n\n${frameData}\n\nFrame Check Sequence (CRC): ${crc}`;
        
        // Create binary representation for visualization
        layerData.binaryRepresentation = stringToBinary(message);
      } else {
        // Extract frame data - but preserve the original data
        // Find the position of the double newline that separates headers from body
        const frameHeaderEndIndex = message.indexOf("\n\n");
        // Find the position of "Frame Check Sequence"
        const frameTrailerStartIndex = message.indexOf("\n\nFrame Check Sequence");
        
        let dataLinkMessage = message;
        if (frameHeaderEndIndex >= 0) {
          if (frameTrailerStartIndex >= 0) {
            dataLinkMessage = message.substring(frameHeaderEndIndex + 2, frameTrailerStartIndex);
          } else {
            dataLinkMessage = message.substring(frameHeaderEndIndex + 2);
          }
        }
        
        // Don't extract or modify the frame data to preserve the original content
        const extractedFrameData = dataLinkMessage;
        
        layerData.data = extractedFrameData;
        layerData.headers = "Source MAC: FF:FF:FF:FF:FF:FF\nDestination MAC: 00:1A:2B:3C:4D:5E";
        layerData.protocols = "Ethernet, PPP, HDLC, Frame Relay";
        layerData.processes = [
          "Checking MAC addresses",
          "Verifying frame integrity (CRC)",
          "Removing frame delimiters",
          "Handling flow control between nodes",
          "Passing data to Network layer"
        ];
        layerData.rawData = message;
        layerData.addedData = "";
        layerData.finalData = extractedFrameData;
        layerData.binaryRepresentation = "";
      }
      break;

    case 1: // Physical Layer
      if (direction === "sending") {
        // Convert to binary representation
        const binaryData = layerData.binaryRepresentation || stringToBinary(message);
        
        layerData.data = binaryData;
        
        // Set protocols based on media type
        switch (mediaType) {
          case "fiber":
            layerData.protocols = "Optical Fiber, SONET/SDH, OTN";
            break;
          case "wireless":
            layerData.protocols = "Wi-Fi (802.11), Bluetooth, Cellular (4G/5G)";
            break;
          default: // cable
            layerData.protocols = "Ethernet, USB, DSL";
            break;
        }
        
        layerData.processes = [
          "Converting frames to bits",
          `Encoding bits into ${mediaType === "cable" ? "electrical signals" : mediaType === "fiber" ? "light pulses" : "radio waves"}`,
          mediaType === "cable" ? "Setting voltage levels for 0s and 1s" : 
          mediaType === "fiber" ? "Modulating light intensity for data transmission" : 
          "Modulating radio frequency carrier waves",
          `Determining transmission rate (${mediaType === "cable" ? "1 Gbps" : mediaType === "fiber" ? "10+ Gbps" : "450+ Mbps"})`,
          `Transmitting bits over ${mediaType === "cable" ? "copper wires" : mediaType === "fiber" ? "glass fibers" : "air"}`
        ];
        
        layerData.rawData = message;
        layerData.addedData = `Conversion to binary signals for ${mediaType === "cable" ? "copper cable" : mediaType === "fiber" ? "optical fiber" : "wireless"} transmission`;
        layerData.finalData = binaryData;
        layerData.binaryRepresentation = binaryData;
        
        // Add media-specific signal pattern
        switch (mediaType) {
          case "fiber":
            layerData.signalPattern = generateLightSignalPattern(binaryData);
            break;
          case "wireless":
            layerData.signalPattern = generateWirelessSignalPattern(binaryData);
            break;
          default: // cable
            layerData.signalPattern = generateElectricalSignalPattern(binaryData);
            break;
        }
      } else {
        // For receiving, we preserve the binary data exactly as it was sent
        const binaryData = message;
        
        layerData.data = binaryData;
        
        // Set protocols based on media type
        switch (mediaType) {
          case "fiber":
            layerData.protocols = "Optical Fiber, SONET/SDH, OTN";
            break;
          case "wireless":
            layerData.protocols = "Wi-Fi (802.11), Bluetooth, Cellular (4G/5G)";
            break;
          default: // cable
            layerData.protocols = "Ethernet, USB, DSL";
            break;
        }
        
        layerData.processes = [
          `Receiving ${mediaType === "cable" ? "electrical signals" : mediaType === "fiber" ? "light pulses" : "radio waves"} from physical medium`,
          "Converting signals back to bits",
          "Synchronizing bit reception",
          `${mediaType === "wireless" ? "Filtering noise and interference" : "Detecting and possibly correcting transmission errors"}`,
          "Passing bits to Data Link layer"
        ];
        
        layerData.rawData = binaryData;
        layerData.addedData = "";
        
        // Preserve the exact binary data for the Data Link layer
        layerData.finalData = `[Ethernet Frame]\nPreamble: 10101010 10101010 10101010 10101010 10101010 10101010 10101010\nStart Frame Delimiter: 10101011\nDestination MAC: 00:1A:2B:3C:4D:5E\nSource MAC: FF:FF:FF:FF:FF:FF\nEtherType: 0x0800 (IPv4)\n\n${binaryData}\n\nFrame Check Sequence (CRC): 0x1D4C6A3B`;
        layerData.binaryRepresentation = binaryData;
        
        // Add media-specific signal pattern
        switch (mediaType) {
          case "fiber":
            layerData.signalPattern = generateLightSignalPattern(binaryData);
            break;
          case "wireless":
            layerData.signalPattern = generateWirelessSignalPattern(binaryData);
            break;
          default: // cable
            layerData.signalPattern = generateElectricalSignalPattern(binaryData);
            break;
        }
      }
      break;
  }

  return layerData;
}

/**
 * Generate electrical signal pattern for visualization
 */
function generateElectricalSignalPattern(binaryData: string): string {
  // Convert binary to voltage levels for visualization
  // Remove spaces for processing
  const cleanBinary = binaryData.replace(/\s/g, '');
  
  let pattern = '';
  for (let i = 0; i < cleanBinary.length; i++) {
    // 1 is high voltage, 0 is low voltage
    pattern += cleanBinary[i] === '1' ? '▄' : '▁';
  }
  
  return pattern;
}

/**
 * Generate light signal pattern for visualization
 */
function generateLightSignalPattern(binaryData: string): string {
  // Convert binary to light intensity levels for visualization
  // Remove spaces for processing
  const cleanBinary = binaryData.replace(/\s/g, '');
  
  let pattern = '';
  for (let i = 0; i < cleanBinary.length; i++) {
    // 1 is bright light, 0 is dim/no light
    pattern += cleanBinary[i] === '1' ? '●' : '○';
  }
  
  return pattern;
}

/**
 * Generate wireless signal pattern for visualization
 */
function generateWirelessSignalPattern(binaryData: string): string {
  // Convert binary to radio wave patterns for visualization
  // Remove spaces for processing
  const cleanBinary = binaryData.replace(/\s/g, '');
  
  let pattern = '';
  for (let i = 0; i < cleanBinary.length; i++) {
    // 1 is strong signal, 0 is weak signal
    pattern += cleanBinary[i] === '1' ? '〰️' : '〜';
  }
  
  return pattern;
}

/**
 * Helper functions for realistic data transformations
 */

// Encode a message (simulate Base64 + encryption)
function encodeMessage(message: string): string {
  try {
    // Simple base64-like encoding for demonstration
    return btoa(message);
  } catch {
    // Fallback for non-ASCII characters
    return `[Encoded: ${message}]`;
  }
}

// Decode a message
function decodeMessage(message: string): string {
  try {
    // Try to decode if it's base64
    if (message.match(/^[A-Za-z0-9+/=]+$/)) {
      return atob(message);
    }
    // If not base64, extract from our custom format
    const match = message.match(/\[Encoded: (.*)\]/);
    if (match) return match[1];
    return message;
  } catch {
    return message;
  }
}

// Generate a realistic session ID
function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'SID:';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Segment data for transport layer
function segmentData(data: string): string {
  // Simulate segmentation by adding segment indicators
  const segmentSize = 20;
  let segmented = '';
  
  for (let i = 0; i < data.length; i += segmentSize) {
    const segment = data.substring(i, Math.min(i + segmentSize, data.length));
    const segmentNumber = Math.floor(i / segmentSize) + 1;
    segmented += `[SEG:${segmentNumber}]${segment}`;
    
    if (i + segmentSize < data.length) {
      segmented += '\n';
    }
  }
  
  return segmented;
}

// Reassemble segments
function reassembleSegments(segmentedData: string): string {
  // Remove segment indicators
  return segmentedData.replace(/\[SEG:\d+\]/g, '').replace(/\n/g, '');
}

// Create network packet
function createPacket(data: string): string {
  // Add packet information
  return `[PKT:${Date.now() % 10000}]${data}`;
}

// Extract packet data
function extractPacketData(packetData: string): string {
  // Remove packet indicators
  return packetData.replace(/\[PKT:\d+\]/g, '');
}

// Create data link frame
function createFrame(data: string): string {
  // Add frame information
  return `[FRM:${(Date.now() % 1000).toString(16).padStart(4, '0')}]${data}`;
}

// Calculate CRC for error detection
function calculateCRC(data: string): string {
  // Simple mock CRC calculation
  let crc = 0;
  for (let i = 0; i < data.length; i++) {
    crc = ((crc << 5) + crc) + data.charCodeAt(i);
  }
  return '0x' + Math.abs(crc).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Generate data specifically for the receiving phase
 * This mirrors the sending process in reverse - input becomes output and output becomes input
 */
function generateReceivingLayerData(
  layerId: number,
  mediaType: string,
  originalMessage: string,
  binaryTransmission: string
): LayerData {
  // We need to build a chain of data transformations going from layer 1 to 7
  // Each layer's input should be the previous layer's output
  
  // Start with what each layer would receive from the layer below
  let currentData = "";
  
  if (layerId === 1) {
    // Physical layer receives the binary transmission
    currentData = binaryTransmission;
  } else if (layerId === 2) {
    // Data link receives from physical - the ethernet frame
    const frameData = createFrame(originalMessage);
    const crc = calculateCRC(frameData);
    currentData = `[Ethernet Frame]\nPreamble: 10101010 10101010 10101010 10101010 10101010 10101010 10101010\nStart Frame Delimiter: 10101011\nDestination MAC: 00:1A:2B:3C:4D:5E\nSource MAC: FF:FF:FF:FF:FF:FF\nEtherType: 0x0800 (IPv4)\n\n${frameData}\n\nFrame Check Sequence (CRC): ${crc}`;
  } else if (layerId === 3) {
    // Network receives from data link - the IP packet
    const packetData = createPacket(originalMessage);
    currentData = `[IP Header]\nVersion: 4\nHeader Length: 20 bytes\nType of Service: 0x00\nTotal Length: ${originalMessage.length + 40} bytes\nIdentification: 0x1234\nFlags: 0x02 (Don't Fragment)\nFragment Offset: 0\nTTL: 64\nProtocol: TCP (6)\nHeader Checksum: 0xB861\nSource IP: 10.0.0.5\nDestination IP: 192.168.1.10\n\n${packetData}`;
  } else if (layerId === 4) {
    // Transport receives from network - the TCP segments
    const segmentedData = segmentData(originalMessage);
    currentData = `[TCP Header]\nSource Port: 80\nDestination Port: 49152\nSequence Number: 2000\nACK Number: 1001\nFlags: PSH, ACK\nWindow Size: 64240\nChecksum: 0x3F4D\n\n${segmentedData}`;
  } else if (layerId === 5) {
    // Session receives from transport - session data
    const sessionId = generateSessionId();
    currentData = `Session-ID: ${sessionId}\nDialog-Control: Half-Duplex\nCheckpoint: 0\n\n${originalMessage}`;
  } else if (layerId === 6) {
    // Presentation receives from session - encoded data
    const encodedMessage = encodeMessage(originalMessage);
    currentData = `Content-Type: text/plain; charset=UTF-8\nContent-Encoding: gzip\nContent-Transfer-Encoding: base64\n\n${encodedMessage}`;
  } else if (layerId === 7) {
    // Application receives from presentation - HTTP data
    currentData = `GET /resource HTTP/1.1\nHost: example.com\nUser-Agent: OSI-Simulator\nAccept: text/html\n\n${originalMessage}`;
  }
  
  // What each layer outputs (removes its headers/processing)
  let outputData = "";
  
  if (layerId === 1) {
    // Physical outputs the ethernet frame to data link
    const frameData = createFrame(originalMessage);
    const crc = calculateCRC(frameData);
    outputData = `[Ethernet Frame]\nPreamble: 10101010 10101010 10101010 10101010 10101010 10101010 10101010\nStart Frame Delimiter: 10101011\nDestination MAC: 00:1A:2B:3C:4D:5E\nSource MAC: FF:FF:FF:FF:FF:FF\nEtherType: 0x0800 (IPv4)\n\n${frameData}\n\nFrame Check Sequence (CRC): ${crc}`;
  } else if (layerId === 2) {
    // Data link outputs the IP packet to network
    const packetData = createPacket(originalMessage);
    outputData = `[IP Header]\nVersion: 4\nHeader Length: 20 bytes\nType of Service: 0x00\nTotal Length: ${originalMessage.length + 40} bytes\nIdentification: 0x1234\nFlags: 0x02 (Don't Fragment)\nFragment Offset: 0\nTTL: 64\nProtocol: TCP (6)\nHeader Checksum: 0xB861\nSource IP: 10.0.0.5\nDestination IP: 192.168.1.10\n\n${packetData}`;
  } else if (layerId === 3) {
    // Network outputs the TCP segments to transport
    const segmentedData = segmentData(originalMessage);
    outputData = `[TCP Header]\nSource Port: 80\nDestination Port: 49152\nSequence Number: 2000\nACK Number: 1001\nFlags: PSH, ACK\nWindow Size: 64240\nChecksum: 0x3F4D\n\n${segmentedData}`;
  } else if (layerId === 4) {
    // Transport outputs the session data
    const sessionId = generateSessionId();
    outputData = `Session-ID: ${sessionId}\nDialog-Control: Half-Duplex\nCheckpoint: 0\n\n${originalMessage}`;
  } else if (layerId === 5) {
    // Session outputs the encoded data to presentation
    const encodedMessage = encodeMessage(originalMessage);
    outputData = `Content-Type: text/plain; charset=UTF-8\nContent-Encoding: gzip\nContent-Transfer-Encoding: base64\n\n${encodedMessage}`;
  } else if (layerId === 6) {
    // Presentation outputs the HTTP data to application
    outputData = `GET /resource HTTP/1.1\nHost: example.com\nUser-Agent: OSI-Simulator\nAccept: text/html\n\n${originalMessage}`;
  } else if (layerId === 7) {
    // Application outputs the final message
    outputData = originalMessage;
  }
  
  // Create the layer data
  const layerData: LayerData = {
    data: currentData,
    protocols: "",
    processes: [],
    rawData: currentData, // Input data for this layer
    addedData: "",
    finalData: outputData, // Output data from this layer
    originalMessage: originalMessage
  };
  
  // Set layer-specific details
  switch (layerId) {
    case 7: // Application Layer
      layerData.protocols = "HTTP, SMTP, FTP, DNS, DHCP";
      layerData.processes = [
        "Data is received from Presentation layer",
        "Application-specific processing is performed",
        "Data is presented to the user application",
        "Final data is ready for the user"
      ];
      layerData.headers = "";
      break;
      
    case 6: // Presentation Layer
      layerData.protocols = "SSL/TLS, MIME, XDR";
      layerData.processes = [
        "Decryption of encrypted data",
        "Decompression of compressed data",
        "Character encoding translation to local format",
        "Conversion from network format to application format"
      ];
      layerData.headers = "Content-Type: text/plain; charset=UTF-8";
      break;
      
    case 5: // Session Layer
      layerData.protocols = "NetBIOS, RPC, PPTP";
      layerData.processes = [
        "Verifying session identifiers",
        "Managing session synchronization",
        "Handling dialog control for data exchange",
        "Preparing to close the session when transmission completes"
      ];
      // Extract session ID from the data
      const sessionMatch = layerData.rawData?.match(/Session-ID: ([^\n]+)/);
      layerData.headers = sessionMatch ? sessionMatch[0] : "Session-ID: Unknown";
      break;
      
    case 4: // Transport Layer
      layerData.protocols = "TCP, UDP, SCTP";
      layerData.processes = [
        "Reassembling segments into complete message",
        "Verifying sequence numbers for correct ordering",
        "Checking for missing segments and requesting retransmission",
        "Implementing error recovery if needed",
        "Passing complete data to Session layer"
      ];
      layerData.headers = "Source Port: 80\nDestination Port: 49152\nSequence Number: 2000\nACK Number: 1001\nWindow Size: 64240";
      break;
      
    case 3: // Network Layer
      layerData.protocols = "IP, ICMP, IGMP, ARP";
      layerData.processes = [
        "Checking destination IP address",
        "Decrementing TTL value",
        "Reassembling fragments if necessary",
        "Routing packet to correct interface",
        "Passing packet to Transport layer"
      ];
      layerData.headers = "Source IP: 10.0.0.5\nDestination IP: 192.168.1.10\nTTL: 64\nProtocol: TCP (6)";
      break;
      
    case 2: // Data Link Layer
      layerData.protocols = "Ethernet, PPP, HDLC, Frame Relay";
      layerData.processes = [
        "Checking MAC addresses",
        "Verifying frame integrity (CRC)",
        "Removing frame delimiters",
        "Handling flow control between nodes",
        "Passing data to Network layer"
      ];
      layerData.headers = "Source MAC: FF:FF:FF:FF:FF:FF\nDestination MAC: 00:1A:2B:3C:4D:5E";
      break;
      
    case 1: // Physical Layer
      // Set protocols based on media type
      switch (mediaType) {
        case "fiber":
          layerData.protocols = "Optical Fiber, SONET/SDH, OTN";
          break;
        case "wireless":
          layerData.protocols = "Wi-Fi (802.11), Bluetooth, Cellular (4G/5G)";
          break;
        default: // cable
          layerData.protocols = "Ethernet, USB, DSL";
          break;
      }
      
      layerData.processes = [
        `Receiving ${mediaType === "cable" ? "electrical signals" : mediaType === "fiber" ? "light pulses" : "radio waves"} from physical medium`,
        "Converting signals back to bits",
        "Synchronizing bit reception",
        `${mediaType === "wireless" ? "Filtering noise and interference" : "Detecting and possibly correcting transmission errors"}`,
        "Passing bits to Data Link layer"
      ];
      
      // For physical layer, use the full binary representation
      layerData.binaryRepresentation = stringToBinary(originalMessage);
      
      // Add media-specific signal pattern
      switch (mediaType) {
        case "fiber":
          layerData.signalPattern = generateLightSignalPattern(layerData.binaryRepresentation);
          break;
        case "wireless":
          layerData.signalPattern = generateWirelessSignalPattern(layerData.binaryRepresentation);
          break;
        default: // cable
          layerData.signalPattern = generateElectricalSignalPattern(layerData.binaryRepresentation);
          break;
      }
      break;
  }
  
  return layerData;
} 