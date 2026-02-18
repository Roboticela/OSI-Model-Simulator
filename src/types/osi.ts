/** OSI Model layer definition */
export interface OSILayer {
  number: number;
  name: string;
  pduName: string;
  description: string;
  exampleProtocols?: string[];
}

export const OSI_LAYERS: OSILayer[] = [
  {
    number: 7,
    name: "Application",
    pduName: "Data",
    description: "User data and application protocols. The message enters the stack here.",
    exampleProtocols: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS"],
  },
  {
    number: 6,
    name: "Presentation",
    pduName: "Data",
    description: "Encryption, compression, encoding. Data is formatted for the session.",
    exampleProtocols: ["SSL/TLS", "JPEG", "MPEG", "ASCII"],
  },
  {
    number: 5,
    name: "Session",
    pduName: "Data",
    description: "Session management, dialog control. Establishes and maintains connection.",
    exampleProtocols: ["NetBIOS", "RPC", "SQL"],
  },
  {
    number: 4,
    name: "Transport",
    pduName: "Segment",
    description: "End-to-end delivery, reliability. Segments data and adds port numbers.",
    exampleProtocols: ["TCP", "UDP"],
  },
  {
    number: 3,
    name: "Network",
    pduName: "Packet",
    description: "Logical addressing, routing. Adds IP headers (source & destination).",
    exampleProtocols: ["IP", "ICMP", "ARP"],
  },
  {
    number: 2,
    name: "Data Link",
    pduName: "Frame",
    description: "Physical addressing, framing. Adds MAC addresses and error checking.",
    exampleProtocols: ["Ethernet", "Wi-Fi", "PPP"],
  },
  {
    number: 1,
    name: "Physical",
    pduName: "Bits",
    description: "Transmission medium. Converts to electrical/optical/radio signals.",
    exampleProtocols: ["Cables", "Fiber", "Radio"],
  },
];

export type TransmissionMedium = "ethernet" | "wifi" | "fiber" | "coaxial" | "radio";
export type ProtocolType = "http" | "https" | "smtp" | "dns" | "ftp";
export type AnimationSpeed = "slow" | "normal" | "fast";

/** Connection establishment: direct (e.g. WebSocket) or 3-way handshake (e.g. TCP) */
export type ConnectionType = "direct" | "handshake";

export interface OSISimulationConfig {
  message: string;
  medium: TransmissionMedium;
  protocol: ProtocolType;
  speed: AnimationSpeed;
  sourceAddress?: string;
  destAddress?: string;
  /** When true, steps auto-advance with time; when false, user clicks layers to view */
  autoAnimate?: boolean;
  /** When true and autoAnimate is on, animation loops from layer 1 after reaching complete */
  autoRepeat?: boolean;
  /** Connection setup: direct (realtime/WebSocket-like) or 3-way handshake (TCP-like) */
  connectionType?: ConnectionType;
}

export type SimulationPhase = "idle" | "handshake" | "sending" | "receiving" | "complete";

/** One header field added at a layer (name + value, optional hex) */
export interface HeaderField {
  name: string;
  value: string;
  hex?: string;
}

/** Real data produced at one layer during encapsulation */
export interface LayerEncapsulation {
  layerNumber: number;
  layerName: string;
  pduName: string;
  /** Header fields added at this layer (with real values) */
  headerFields: HeaderField[];
  /** Payload received from upper layer (hex or description) */
  payloadFromUpperLayer: string;
  /** Size in bytes of the payload from upper layer */
  inputSizeBytes: number;
  /** Full PDU in hex after this layer (what gets passed down) */
  pduHex: string;
  /** Size in bytes */
  pduSizeBytes: number;
  /** Short summary: what this layer did (e.g. "Added TCP header with ports and sequence number") */
  whatHappened: string;
  /** Human-readable form when applicable (e.g. L7 HTTP text) */
  humanReadable?: string;
  /** For L1: bits representation (optional) */
  bitsPreview?: string;

  // ── Extended educational fields ──────────────────────────────────────
  /** Complete hex of input payload (not truncated) */
  inputHexFull: string;
  /** Complete formatted binary of input payload (one byte per group, 4 bytes per line) */
  inputBinary: string;
  /** Human-readable description of what the input data is */
  inputHumanReadable: string;
  /** Complete formatted binary of the output PDU */
  outputBinary: string;
  /** Educational explanation of what this layer does (for students) */
  layerDescription: string;
  /** Protocols that operate at this layer */
  protocols: string[];
  /** Hardware / devices that operate at this layer */
  hardware: string[];
}
