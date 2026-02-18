interface LayerData {
  data: string;
  headers?: string;
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
  originalMessage?: string; 
}

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
 * Process a user message through all OSI layers.
 */
export function processMessage(message: string, mediaType: string = "cable"): SimulationData {
  const simulationData: SimulationData = {
    originalMessage: message,
    layers: {}
  };

  let processedData = message;
  
  for (let i = 7; i >= 1; i--) {
    const layerData = generateLayerData(processedData, i, "sending", mediaType, message);
    simulationData.layers[i] = {
      sending: layerData,
      receiving: {} as LayerData 
    };
    
    processedData = layerData.finalData || processedData;
  }
  
  const binaryTransmission = processedData;
  
  for (let i = 1; i <= 7; i++) {
    const layerData = generateReceivingLayerData(i, mediaType, message, binaryTransmission);
    simulationData.layers[i].receiving = layerData;
  }
  
  return simulationData;
}

/**
 * Get data for a specific layer.
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
  const layerData: LayerData = {
    data: message,
    protocols: "",
    processes: [],
    rawData: message,
    addedData: "",
    finalData: "",
    originalMessage: originalMessage 
  };
  
  if (direction === "receiving" && layerId > 1 && layerId < 7 && originalMessage) {
    layerData.finalData = message;
  }

  switch (layerId) {
    case 7: 
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
        
        if (originalMessage) {
          layerData.finalData = originalMessage;
        } else {
          layerData.finalData = message;
        }
        
        layerData.binaryRepresentation = "";
      }
      break;

    case 6: 
      if (direction === "sending") {
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

    case 5: 
      if (direction === "sending") {
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

    case 4: 
      if (direction === "sending") {
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

    case 3: 
      if (direction === "sending") {
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

    case 2: 
      if (direction === "sending") {
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
        
        layerData.binaryRepresentation = stringToBinary(message);
      } else {
        const frameHeaderEndIndex = message.indexOf("\n\n");
        const frameTrailerStartIndex = message.indexOf("\n\nFrame Check Sequence");
        
        let dataLinkMessage = message;
        if (frameHeaderEndIndex >= 0) {
          if (frameTrailerStartIndex >= 0) {
            dataLinkMessage = message.substring(frameHeaderEndIndex + 2, frameTrailerStartIndex);
          } else {
            dataLinkMessage = message.substring(frameHeaderEndIndex + 2);
          }
        }
        
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

    case 1: 
      if (direction === "sending") {
        const binaryData = layerData.binaryRepresentation || stringToBinary(message);
        
        layerData.data = binaryData;
        
        switch (mediaType) {
          case "fiber":
            layerData.protocols = "Optical Fiber, SONET/SDH, OTN";
            break;
          case "wireless":
            layerData.protocols = "Wi-Fi (802.11), Bluetooth, Cellular (4G/5G)";
            break;
          default: 
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
        
        switch (mediaType) {
          case "fiber":
            layerData.signalPattern = generateLightSignalPattern(binaryData);
            break;
          case "wireless":
            layerData.signalPattern = generateWirelessSignalPattern(binaryData);
            break;
          default: 
            layerData.signalPattern = generateElectricalSignalPattern(binaryData);
            break;
        }
      } else {
        const binaryData = message;
        
        layerData.data = binaryData;

        switch (mediaType) {
          case "fiber":
            layerData.protocols = "Optical Fiber, SONET/SDH, OTN";
            break;
          case "wireless":
            layerData.protocols = "Wi-Fi (802.11), Bluetooth, Cellular (4G/5G)";
            break;
          default: 
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
        
        layerData.finalData = `[Ethernet Frame]\nPreamble: 10101010 10101010 10101010 10101010 10101010 10101010 10101010\nStart Frame Delimiter: 10101011\nDestination MAC: 00:1A:2B:3C:4D:5E\nSource MAC: FF:FF:FF:FF:FF:FF\nEtherType: 0x0800 (IPv4)\n\n${binaryData}\n\nFrame Check Sequence (CRC): 0x1D4C6A3B`;
        layerData.binaryRepresentation = binaryData;
        
        switch (mediaType) {
          case "fiber":
            layerData.signalPattern = generateLightSignalPattern(binaryData);
            break;
          case "wireless":
            layerData.signalPattern = generateWirelessSignalPattern(binaryData);
            break;
          default: 
            layerData.signalPattern = generateElectricalSignalPattern(binaryData);
            break;
        }
      }
      break;
  }

  return layerData;
}

/**
 * Generate electrical signal pattern for visualization.
 */
function generateElectricalSignalPattern(binaryData: string): string {
  const cleanBinary = binaryData.replace(/\s/g, '');
  
  let pattern = '';
  for (let i = 0; i < cleanBinary.length; i++) {
    pattern += cleanBinary[i] === '1' ? '▄' : '▁';
  }
  
  return pattern;
}

/**
 * Generate light signal pattern for visualization.
 */
function generateLightSignalPattern(binaryData: string): string {
  const cleanBinary = binaryData.replace(/\s/g, '');
  
  let pattern = '';
  for (let i = 0; i < cleanBinary.length; i++) {
    pattern += cleanBinary[i] === '1' ? '●' : '○';
  }
  
  return pattern;
}

/**
 * Generate wireless signal pattern for visualization.
 */
function generateWirelessSignalPattern(binaryData: string): string {
  const cleanBinary = binaryData.replace(/\s/g, '');
  
  let pattern = '';
  for (let i = 0; i < cleanBinary.length; i++) {  
    pattern += cleanBinary[i] === '1' ? '〰️' : '〜';
  }
  
  return pattern;
}

/**
 * Helper functions for realistic data transformations.
 */

function encodeMessage(message: string): string {
  try {
    return btoa(message);
  } catch {
    return `[Encoded: ${message}]`;
  }
}

function decodeMessage(message: string): string {
  try {
    if (message.match(/^[A-Za-z0-9+/=]+$/)) {
      return atob(message);
    }
    const match = message.match(/\[Encoded: (.*)\]/);
    if (match) return match[1];
    return message;
  } catch {
    return message;
  }
}

function generateSessionId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'SID:';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function segmentData(data: string): string {
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

function reassembleSegments(segmentedData: string): string {
  return segmentedData.replace(/\[SEG:\d+\]/g, '').replace(/\n/g, '');
}

function createPacket(data: string): string {
  return `[PKT:${Date.now() % 10000}]${data}`;
}

function extractPacketData(packetData: string): string {
  return packetData.replace(/\[PKT:\d+\]/g, '');
}

function createFrame(data: string): string {
  return `[FRM:${(Date.now() % 1000).toString(16).padStart(4, '0')}]${data}`;
}

function calculateCRC(data: string): string {
  let crc = 0;
  for (let i = 0; i < data.length; i++) {
    crc = ((crc << 5) + crc) + data.charCodeAt(i);
  }
  return '0x' + Math.abs(crc).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Generate data specifically for the receiving phase.
 * This mirrors the sending process in reverse - input becomes output and output becomes input.
 */
function generateReceivingLayerData(
  layerId: number,
  mediaType: string,
  originalMessage: string,
  binaryTransmission: string
): LayerData {
  
  let currentData = "";
  
  if (layerId === 1) {
    currentData = binaryTransmission;
  } else if (layerId === 2) {
    const frameData = createFrame(originalMessage);
    const crc = calculateCRC(frameData);
    currentData = `[Ethernet Frame]\nPreamble: 10101010 10101010 10101010 10101010 10101010 10101010 10101010\nStart Frame Delimiter: 10101011\nDestination MAC: 00:1A:2B:3C:4D:5E\nSource MAC: FF:FF:FF:FF:FF:FF\nEtherType: 0x0800 (IPv4)\n\n${frameData}\n\nFrame Check Sequence (CRC): ${crc}`;
  } else if (layerId === 3) {
    const packetData = createPacket(originalMessage);
    currentData = `[IP Header]\nVersion: 4\nHeader Length: 20 bytes\nType of Service: 0x00\nTotal Length: ${originalMessage.length + 40} bytes\nIdentification: 0x1234\nFlags: 0x02 (Don't Fragment)\nFragment Offset: 0\nTTL: 64\nProtocol: TCP (6)\nHeader Checksum: 0xB861\nSource IP: 10.0.0.5\nDestination IP: 192.168.1.10\n\n${packetData}`;
  } else if (layerId === 4) {
    const segmentedData = segmentData(originalMessage);
    currentData = `[TCP Header]\nSource Port: 80\nDestination Port: 49152\nSequence Number: 2000\nACK Number: 1001\nFlags: PSH, ACK\nWindow Size: 64240\nChecksum: 0x3F4D\n\n${segmentedData}`;
  } else if (layerId === 5) {
    const sessionId = generateSessionId();
    currentData = `Session-ID: ${sessionId}\nDialog-Control: Half-Duplex\nCheckpoint: 0\n\n${originalMessage}`;
  } else if (layerId === 6) {
    const encodedMessage = encodeMessage(originalMessage);
    currentData = `Content-Type: text/plain; charset=UTF-8\nContent-Encoding: gzip\nContent-Transfer-Encoding: base64\n\n${encodedMessage}`;
  } else if (layerId === 7) {
    currentData = `GET /resource HTTP/1.1\nHost: example.com\nUser-Agent: OSI-Simulator\nAccept: text/html\n\n${originalMessage}`;
  }
  
  let outputData = "";
  
  if (layerId === 1) {
    const frameData = createFrame(originalMessage);
    const crc = calculateCRC(frameData);
    outputData = `[Ethernet Frame]\nPreamble: 10101010 10101010 10101010 10101010 10101010 10101010 10101010\nStart Frame Delimiter: 10101011\nDestination MAC: 00:1A:2B:3C:4D:5E\nSource MAC: FF:FF:FF:FF:FF:FF\nEtherType: 0x0800 (IPv4)\n\n${frameData}\n\nFrame Check Sequence (CRC): ${crc}`;
  } else if (layerId === 2) {   
    const packetData = createPacket(originalMessage);
    outputData = `[IP Header]\nVersion: 4\nHeader Length: 20 bytes\nType of Service: 0x00\nTotal Length: ${originalMessage.length + 40} bytes\nIdentification: 0x1234\nFlags: 0x02 (Don't Fragment)\nFragment Offset: 0\nTTL: 64\nProtocol: TCP (6)\nHeader Checksum: 0xB861\nSource IP: 10.0.0.5\nDestination IP: 192.168.1.10\n\n${packetData}`;
  } else if (layerId === 3) {
    const segmentedData = segmentData(originalMessage);
    outputData = `[TCP Header]\nSource Port: 80\nDestination Port: 49152\nSequence Number: 2000\nACK Number: 1001\nFlags: PSH, ACK\nWindow Size: 64240\nChecksum: 0x3F4D\n\n${segmentedData}`;
  } else if (layerId === 4) {
    const sessionId = generateSessionId();
    outputData = `Session-ID: ${sessionId}\nDialog-Control: Half-Duplex\nCheckpoint: 0\n\n${originalMessage}`;
  } else if (layerId === 5) {
    const encodedMessage = encodeMessage(originalMessage);
    outputData = `Content-Type: text/plain; charset=UTF-8\nContent-Encoding: gzip\nContent-Transfer-Encoding: base64\n\n${encodedMessage}`;
  } else if (layerId === 6) {
    outputData = `GET /resource HTTP/1.1\nHost: example.com\nUser-Agent: OSI-Simulator\nAccept: text/html\n\n${originalMessage}`;
  } else if (layerId === 7) {
    outputData = originalMessage;
  }
  
  const layerData: LayerData = {
    data: currentData,
    protocols: "",
    processes: [],
    rawData: currentData, 
    addedData: "",
    finalData: outputData, 
    originalMessage: originalMessage
  };
  
  switch (layerId) {
    case 7: 
      layerData.protocols = "HTTP, SMTP, FTP, DNS, DHCP";
      layerData.processes = [
        "Data is received from Presentation layer",
        "Application-specific processing is performed",
        "Data is presented to the user application",
        "Final data is ready for the user"
      ];
      layerData.headers = "";
      break;
      
    case 6: 
      layerData.protocols = "SSL/TLS, MIME, XDR";
      layerData.processes = [
        "Decryption of encrypted data",
        "Decompression of compressed data",
        "Character encoding translation to local format",
        "Conversion from network format to application format"
      ];
      layerData.headers = "Content-Type: text/plain; charset=UTF-8";
      break;
      
    case 5: 
      layerData.protocols = "NetBIOS, RPC, PPTP";
      layerData.processes = [
        "Verifying session identifiers",
        "Managing session synchronization",
        "Handling dialog control for data exchange",
        "Preparing to close the session when transmission completes"
      ];
      const sessionMatch = layerData.rawData?.match(/Session-ID: ([^\n]+)/);
      layerData.headers = sessionMatch ? sessionMatch[0] : "Session-ID: Unknown";
      break;
      
    case 4: 
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
      
    case 3: 
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
      
    case 2: 
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
      
    case 1: 
      switch (mediaType) {
        case "fiber":
          layerData.protocols = "Optical Fiber, SONET/SDH, OTN";
          break;
        case "wireless":
          layerData.protocols = "Wi-Fi (802.11), Bluetooth, Cellular (4G/5G)";
          break;
        default: 
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
      
      layerData.binaryRepresentation = stringToBinary(originalMessage);
      
      switch (mediaType) {
        case "fiber":
          layerData.signalPattern = generateLightSignalPattern(layerData.binaryRepresentation);
          break;
        case "wireless":
          layerData.signalPattern = generateWirelessSignalPattern(layerData.binaryRepresentation);
          break;
        default: 
          layerData.signalPattern = generateElectricalSignalPattern(layerData.binaryRepresentation);
          break;
      }
      break;
  }
  
  return layerData;
} 