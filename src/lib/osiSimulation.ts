/**
 * Real OSI encapsulation simulation: builds actual headers and PDUs
 * for each layer with real field values and hex output.
 */

import type { OSISimulationConfig, LayerEncapsulation, HeaderField } from "../types/osi";

const PROTOCOL_PORTS: Record<string, number> = {
  https: 443,
  http: 80,
  smtp: 25,
  dns: 53,
  ftp: 21,
};

const PROTOCOL_TCP = 6;

function strToBytes(s: string): number[] {
  return Array.from(new TextEncoder().encode(s));
}

function bytesToHexCompact(bytes: number[]): string {
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function parseIPv4(ip: string): number[] {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return [192, 168, 1, 10];
  const out: number[] = [];
  for (const p of parts) {
    const n = parseInt(p, 10);
    if (Number.isNaN(n) || n < 0 || n > 255) return [192, 168, 1, 10];
    out.push(n);
  }
  return out;
}

function writeU16BE(arr: number[], offset: number, value: number): void {
  arr[offset] = (value >> 8) & 0xff;
  arr[offset + 1] = value & 0xff;
}

function writeU32BE(arr: number[], offset: number, value: number): void {
  arr[offset] = (value >> 24) & 0xff;
  arr[offset + 1] = (value >> 16) & 0xff;
  arr[offset + 2] = (value >> 8) & 0xff;
  arr[offset + 3] = value & 0xff;
}

/** Build Application layer (L7) payload - real HTTP/SMTP/DNS/FTP style data */
function buildLayer7(config: OSISimulationConfig): { bytes: number[]; human: string; fields: HeaderField[] } {
  const msg = config.message || "Hello, World!";
  const protocol = config.protocol || "https";
  const dest = config.destAddress || "93.184.216.34";

  let requestText: string;
  const fields: HeaderField[] = [];

  if (protocol === "http" || protocol === "https") {
    const body = msg;
    const contentLength = strToBytes(body).length;
    requestText =
      `POST /api/message HTTP/1.1\r\n` +
      `Host: ${dest}\r\n` +
      `Content-Type: text/plain; charset=UTF-8\r\n` +
      `Content-Length: ${contentLength}\r\n` +
      `Connection: keep-alive\r\n` +
      `\r\n` +
      body;
    fields.push({ name: "Request Line", value: "POST /api/message HTTP/1.1" });
    fields.push({ name: "Host", value: dest });
    fields.push({ name: "Content-Type", value: "text/plain; charset=UTF-8" });
    fields.push({ name: "Content-Length", value: String(contentLength) });
    fields.push({ name: "Body (Data)", value: body.slice(0, 60) + (body.length > 60 ? "…" : "") });
  } else if (protocol === "smtp") {
    requestText =
      `MAIL FROM:<sender@local>\r\n` +
      `RCPT TO:<recipient@example.com>\r\n` +
      `DATA\r\n` +
      `${msg}\r\n` +
      `.\r\n`;
    fields.push({ name: "MAIL FROM", value: "<sender@local>" });
    fields.push({ name: "RCPT TO", value: "<recipient@example.com>" });
    fields.push({ name: "DATA", value: "Message body" });
    fields.push({ name: "Body", value: msg.slice(0, 50) + (msg.length > 50 ? "…" : "") });
  } else if (protocol === "dns") {
    const qname = "example.com";
    requestText = `DNS Query: ${qname} A IN`; // Simplified; real DNS is binary
    fields.push({ name: "Query", value: qname });
    fields.push({ name: "Type", value: "A" });
    fields.push({ name: "Class", value: "IN" });
    return { bytes: strToBytes(requestText), human: requestText, fields };
  } else if (protocol === "ftp") {
    requestText = `USER anonymous\r\nPASS \r\nRETR message.txt\r\n` + `\r\n${msg}\r\n`;
    fields.push({ name: "USER", value: "anonymous" });
    fields.push({ name: "Command", value: "RETR message.txt" });
    fields.push({ name: "Data", value: msg.slice(0, 40) + (msg.length > 40 ? "…" : "") });
  } else {
    requestText = msg;
    fields.push({ name: "Data", value: msg });
  }

  const bytes = strToBytes(requestText);
  return { bytes, human: requestText, fields };
}

/** Layer 6 – Presentation: encoding / TLS record placeholder */
function buildLayer6(
  config: OSISimulationConfig,
  payload: number[]
): { bytes: number[]; fields: HeaderField[] } {
  const protocol = config.protocol || "https";
  const fields: HeaderField[] = [];

  if (protocol === "https") {
    // TLS Record header (5 bytes): Type, Version (2), Length (2)
    const tlsType = 0x17; // Application Data
    const tlsVersion = 0x0303; // TLS 1.2
    const tlsLength = payload.length;
    const record = [
      tlsType,
      (tlsVersion >> 8) & 0xff,
      tlsVersion & 0xff,
      (tlsLength >> 8) & 0xff,
      tlsLength & 0xff,
      ...payload,
    ];
    fields.push({ name: "Content Type", value: "Application Data (23)", hex: "17" });
    fields.push({ name: "Version", value: "TLS 1.2", hex: "03 03" });
    fields.push({ name: "Length", value: String(tlsLength), hex: (tlsLength.toString(16).padStart(4, "0").match(/.{2}/g) || ["00", "00"]).join(" ") });
    fields.push({ name: "Encrypted payload", value: `[${payload.length} bytes]` });
    return { bytes: record, fields };
  }

  fields.push({ name: "Content-Type", value: "text/plain; charset=UTF-8" });
  fields.push({ name: "Encoding", value: "identity" });
  return { bytes: payload, fields };
}

/** Layer 5 – Session: session identifier */
function buildLayer5(payload: number[]): { bytes: number[]; fields: HeaderField[] } {
  const sessionId = 0x1a2b3c4d;
  const header = [
    (sessionId >> 24) & 0xff,
    (sessionId >> 16) & 0xff,
    (sessionId >> 8) & 0xff,
    sessionId & 0xff,
  ];
  const bytes = [...header, ...payload];
  const fields: HeaderField[] = [
    { name: "Session ID", value: "0x1a2b3c4d", hex: "1a 2b 3c 4d" },
  ];
  return { bytes, fields };
}

/** Layer 4 – Transport: TCP header (20 bytes) */
function buildLayer4(
  config: OSISimulationConfig,
  payload: number[]
): { bytes: number[]; fields: HeaderField[] } {
  const srcPort = 49152 + (Math.floor(Math.random() * 16384) % 16384);
  const dstPort = PROTOCOL_PORTS[config.protocol] ?? 443;
  const seq = 1000;
  const ack = 0;
  const dataOffset = 5; // 20 bytes
  const flags = 0x18; // PSH + ACK
  const window = 65535;
  const checksum = 0xb1c2; // placeholder

  const header = new Array(20).fill(0);
  writeU16BE(header, 0, srcPort);
  writeU16BE(header, 2, dstPort);
  writeU32BE(header, 4, seq);
  writeU32BE(header, 8, ack);
  header[12] = (dataOffset << 4) & 0xff;
  header[13] = 0;
  header[14] = (flags >> 8) & 0xff;
  header[15] = flags & 0xff;
  writeU16BE(header, 16, window);
  writeU16BE(header, 18, checksum);  // 18-19: checksum (urgent pointer omitted for simplicity; would be 18-19 if used)
  const bytes = [...header, ...payload];
  const fields: HeaderField[] = [
    { name: "Source Port", value: String(srcPort), hex: (srcPort >> 8).toString(16).padStart(2, "0") + " " + (srcPort & 0xff).toString(16).padStart(2, "0") },
    { name: "Dest Port", value: String(dstPort), hex: (dstPort >> 8).toString(16).padStart(2, "0") + " " + (dstPort & 0xff).toString(16).padStart(2, "0") },
    { name: "Seq Number", value: String(seq), hex: "00 00 03 e8" },
    { name: "Ack Number", value: String(ack), hex: "00 00 00 00" },
    { name: "Data Offset", value: "20 bytes (5)" },
    { name: "Flags", value: "PSH, ACK", hex: "18" },
    { name: "Window", value: String(window), hex: "ff ff" },
    { name: "Checksum", value: "0x" + checksum.toString(16), hex: "b1 c2" },
  ];
  return { bytes, fields };
}

/** Layer 3 – Network: IP header (20 bytes) */
function buildLayer3(
  config: OSISimulationConfig,
  payload: number[]
): { bytes: number[]; fields: HeaderField[] } {
  const srcIP = parseIPv4(config.sourceAddress || "192.168.1.10");
  const dstIP = parseIPv4(config.destAddress || "93.184.216.34");
  const version = 4;
  const ihl = 5;
  const tos = 0;
  const totalLength = 20 + payload.length;
  const id = 0x1a2b;
  const flagsFrag = 0x4000; // Don't fragment
  const ttl = 64;
  const protocol = PROTOCOL_TCP;
  const checksum = 0x8f3a; // placeholder

  const header = new Array(20).fill(0);
  header[0] = (version << 4) | ihl;
  header[1] = tos;
  writeU16BE(header, 2, totalLength);
  writeU16BE(header, 4, id);
  writeU16BE(header, 6, flagsFrag);
  header[8] = ttl;
  header[9] = protocol;
  writeU16BE(header, 10, checksum);
  header[12] = srcIP[0];
  header[13] = srcIP[1];
  header[14] = srcIP[2];
  header[15] = srcIP[3];
  header[16] = dstIP[0];
  header[17] = dstIP[1];
  header[18] = dstIP[2];
  header[19] = dstIP[3];

  const bytes = [...header, ...payload];
  const srcStr = srcIP.join(".");
  const dstStr = dstIP.join(".");
  const fields: HeaderField[] = [
    { name: "Version", value: "4" },
    { name: "IHL", value: "5 (20 bytes)" },
    { name: "Total Length", value: String(totalLength) },
    { name: "Identification", value: "0x" + id.toString(16) },
    { name: "Flags", value: "Don't Fragment" },
    { name: "TTL", value: String(ttl) },
    { name: "Protocol", value: "TCP (6)" },
    { name: "Header Checksum", value: "0x" + checksum.toString(16) },
    { name: "Source IP", value: srcStr, hex: srcIP.map((b) => b.toString(16).padStart(2, "0")).join(" ") },
    { name: "Dest IP", value: dstStr, hex: dstIP.map((b) => b.toString(16).padStart(2, "0")).join(" ") },
  ];
  return { bytes, fields };
}

/** Layer 2 – Data Link: Ethernet II frame (14 byte header + 4 FCS) */
function buildLayer2(
  _config: OSISimulationConfig,
  payload: number[]
): { bytes: number[]; fields: HeaderField[] } {
  const destMAC = [0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e];
  const srcMAC = [0x00, 0x0f, 0x11, 0x22, 0x33, 0x44];
  const etherType = 0x0800; // IPv4

  const header = [
    ...destMAC,
    ...srcMAC,
    (etherType >> 8) & 0xff,
    etherType & 0xff,
  ];
  // FCS (4 bytes) - simplified checksum
  const fcs = [0x12, 0x34, 0x56, 0x78];
  const bytes = [...header, ...payload, ...fcs];

  const fields: HeaderField[] = [
    { name: "Dest MAC", value: destMAC.map((b) => b.toString(16).padStart(2, "0")).join(":"), hex: destMAC.map((b) => b.toString(16).padStart(2, "0")).join(" ") },
    { name: "Src MAC", value: srcMAC.map((b) => b.toString(16).padStart(2, "0")).join(":"), hex: srcMAC.map((b) => b.toString(16).padStart(2, "0")).join(" ") },
    { name: "Type", value: "IPv4 (0x0800)", hex: "08 00" },
    { name: "Payload", value: `IP packet (${payload.length} bytes)` },
    { name: "FCS", value: "Frame Check Sequence (4 bytes)", hex: "12 34 56 78" },
  ];
  return { bytes, fields };
}

/** Layer 1 – Physical: same as L2, display as bits */
function buildLayer1(l2Bytes: number[]): { bitsPreview: string; fields: HeaderField[] } {
  const firstBytes = l2Bytes.slice(0, 8);
  const bits = firstBytes
    .map((b) => b.toString(2).padStart(8, "0"))
    .join(" ");
  const fields: HeaderField[] = [
    { name: "Medium", value: "Electrical / Optical / Radio" },
    { name: "First 8 bytes (bits)", value: bits },
    { name: "Total frame size", value: l2Bytes.length + " bytes = " + l2Bytes.length * 8 + " bits" },
  ];
  return { bitsPreview: bits, fields };
}

// ── Per-layer static metadata ──────────────────────────────────────────────

const LAYER_DESCRIPTIONS: Record<number, string> = {
  7: "The Application layer is the topmost layer and the one closest to the end user. It provides network services directly to applications like web browsers, email clients, and file transfer programs. When you send an HTTP request, this layer formats it with the correct method, URL, headers, and body. It does not refer to the application itself — it defines the protocol the application uses to communicate over a network.",
  6: "The Presentation layer is the network's 'translator'. It converts data between application format and a common network format so that two systems with different encodings can understand each other. Key responsibilities include: character encoding (ASCII ↔ Unicode), data compression to reduce size, and encryption/decryption via TLS/SSL to secure the data. When using HTTPS, TLS wraps the application data in a record header that includes content type, protocol version, and payload length.",
  5: "The Session layer manages communication sessions — logical, persistent connections between two applications on different hosts. It establishes the session before data transfer, maintains it during communication, and terminates it gracefully when done. It also handles synchronization checkpoints so that a long transfer can resume from a known point if interrupted, rather than restarting from scratch. A unique Session ID is assigned to each session.",
  4: "The Transport layer provides reliable end-to-end delivery between processes running on different hosts, identified by port numbers. TCP (Transmission Control Protocol) adds a 20-byte header with source and destination ports, sequence numbers for ordering, acknowledgment numbers for reliability, flags (e.g. SYN, ACK, PSH), window size for flow control, and a checksum for error detection. The result is called a Segment. UDP provides a simpler, faster, connectionless alternative without guaranteed delivery.",
  3: "The Network layer is responsible for logical addressing and routing data across multiple networks. Routers operate at this layer, reading the destination IP address in the packet header to determine the best path. The IPv4 header (20 bytes) contains source and destination IP addresses, TTL (Time-To-Live) to prevent infinite loops, protocol field (6 = TCP), total packet length, and a header checksum. The PDU at this layer is called a Packet.",
  2: "The Data Link layer handles reliable communication between two directly connected nodes on the same local network, using MAC (Media Access Control) addresses. It takes the IP packet, wraps it in an Ethernet frame with a 14-byte header (destination MAC, source MAC, EtherType), and appends a 4-byte FCS (Frame Check Sequence) for error detection using CRC. Switches and NICs operate at this layer. The PDU is called a Frame.",
  1: "The Physical layer is the lowest layer and is responsible for transmitting raw bits over a physical medium. It defines the electrical, optical, or radio signal characteristics — voltages, frequencies, pin layouts, and cable types. There is no addressing or error handling here; it simply converts the binary stream of 0s and 1s from the Data Link frame into signals and transmits them. On the receiving end, it converts signals back to bits and passes the frame up to Layer 2.",
};

const LAYER_PROTOCOLS: Record<number, string[]> = {
  7: ["HTTP", "HTTPS", "FTP", "SMTP", "DNS", "SSH", "Telnet", "SNMP", "DHCP", "POP3", "IMAP"],
  6: ["TLS", "SSL", "JPEG", "MPEG", "GIF", "PNG", "ASCII", "Unicode", "MIME", "XDR"],
  5: ["NetBIOS", "RPC", "PPTP", "NFS", "SMB", "SQL", "L2TP"],
  4: ["TCP", "UDP", "SCTP", "DCCP"],
  3: ["IPv4", "IPv6", "ICMP", "ICMPv6", "OSPF", "BGP", "RIP", "ARP", "NAT"],
  2: ["Ethernet (802.3)", "Wi-Fi (802.11)", "PPP", "HDLC", "ARP", "VLAN (802.1Q)", "Spanning Tree (STP)"],
  1: ["IEEE 802.3 (Ethernet)", "IEEE 802.11 (Wi-Fi)", "USB", "Bluetooth", "DSL", "SONET/SDH", "RS-232"],
};

const LAYER_HARDWARE: Record<number, string[]> = {
  7: ["Web Browsers", "Web Servers", "Email Clients/Servers", "DNS Servers", "FTP Clients/Servers", "Application Gateways"],
  6: ["SSL/TLS Terminators", "Gateways", "Web Servers (SSL)", "Application Firewalls"],
  5: ["Gateways", "Application Servers", "Session Border Controllers"],
  4: ["Firewalls (stateful)", "Load Balancers", "Application Delivery Controllers"],
  3: ["Routers", "Layer-3 Switches", "Firewalls", "Multilayer Switches"],
  2: ["Ethernet Switches", "Bridges", "Wireless Access Points", "Network Interface Cards (NIC)"],
  1: ["Ethernet Cables (Cat5/Cat6)", "Fiber Optic Cables", "Hubs", "Repeaters", "Modems", "Network Interface Cards (NIC)"],
};

/** Run full encapsulation and return real layer data for steps 1..7 */
export function buildEncapsulation(config: OSISimulationConfig): LayerEncapsulation[] {
  const result: LayerEncapsulation[] = [];

  // ── Layer 7: Application ────────────────────────────────────────────
  const l7 = buildLayer7(config);
  const l7Hex = bytesToHexCompact(l7.bytes);
  const msgBytes = strToBytes(config.message || "Hello, World!");
  const msgHex = bytesToHexCompact(msgBytes);
  result.push({
    layerNumber: 7,
    layerName: "Application",
    pduName: "Data",
    headerFields: l7.fields,
    payloadFromUpperLayer: "[User message]",
    inputSizeBytes: msgBytes.length,
    pduHex: l7Hex,
    pduSizeBytes: l7.bytes.length,
    whatHappened: "Application created the message: request line, headers (Host, Content-Type, Content-Length), and body. Data is ready for the presentation layer.",
    humanReadable: l7.human,
    inputHexFull: msgHex,
    inputBinary: bytesToBinaryFormatted(msgBytes),
    inputHumanReadable: config.message || "Hello, World!",
    outputBinary: bytesToBinaryFormatted(l7.bytes),
    layerDescription: LAYER_DESCRIPTIONS[7],
    protocols: LAYER_PROTOCOLS[7],
    hardware: LAYER_HARDWARE[7],
  });

  // ── Layer 6: Presentation ───────────────────────────────────────────
  const l6 = buildLayer6(config, l7.bytes);
  const l6Hex = bytesToHexCompact(l6.bytes);
  const l6Readable =
    config.protocol === "https"
      ? `TLS Record | Type: Application Data (23) | Version: TLS 1.2 | Length: ${l6.bytes.length} bytes\n[Encrypted payload: ${l7.bytes.length} bytes]`
      : `Presentation data | Content-Type: text/plain; charset=UTF-8 | Encoding: identity\n[Payload: ${l6.bytes.length} bytes unchanged]`;
  result.push({
    layerNumber: 6,
    layerName: "Presentation",
    pduName: "Data",
    headerFields: l6.fields,
    payloadFromUpperLayer: l7Hex.slice(0, 80) + (l7Hex.length > 80 ? "…" : ""),
    inputSizeBytes: l7.bytes.length,
    pduHex: l6Hex,
    pduSizeBytes: l6.bytes.length,
    whatHappened: config.protocol === "https"
      ? "TLS record header was added (type, version, length). Application data is prepared for encryption; shown here as encrypted payload placeholder."
      : "Content-Type and encoding were set. Data passed through unchanged (no encryption).",
    humanReadable: l6Readable,
    inputHexFull: l7Hex,
    inputBinary: bytesToBinaryFormatted(l7.bytes),
    inputHumanReadable: l7.human,
    outputBinary: bytesToBinaryFormatted(l6.bytes),
    layerDescription: LAYER_DESCRIPTIONS[6],
    protocols: LAYER_PROTOCOLS[6],
    hardware: LAYER_HARDWARE[6],
  });

  // ── Layer 5: Session ────────────────────────────────────────────────
  const l5 = buildLayer5(l6.bytes);
  const l5Hex = bytesToHexCompact(l5.bytes);
  const l5Readable = `Session PDU | Session ID: 0x1a2b3c4d (4 bytes)\n[Data from presentation: ${l6.bytes.length} bytes] → Total: ${l5.bytes.length} bytes`;
  result.push({
    layerNumber: 5,
    layerName: "Session",
    pduName: "Data",
    headerFields: l5.fields,
    payloadFromUpperLayer: l6Hex.slice(0, 80) + (l6Hex.length > 80 ? "…" : ""),
    inputSizeBytes: l6.bytes.length,
    pduHex: l5Hex,
    pduSizeBytes: l5.bytes.length,
    whatHappened: "Session ID (4 bytes) was added to identify and manage this session. Data is now tied to a session for dialog control.",
    humanReadable: l5Readable,
    inputHexFull: l6Hex,
    inputBinary: bytesToBinaryFormatted(l6.bytes),
    inputHumanReadable: l6Readable,
    outputBinary: bytesToBinaryFormatted(l5.bytes),
    layerDescription: LAYER_DESCRIPTIONS[5],
    protocols: LAYER_PROTOCOLS[5],
    hardware: LAYER_HARDWARE[5],
  });

  // ── Layer 4: Transport ──────────────────────────────────────────────
  const l4 = buildLayer4(config, l5.bytes);
  const l4Hex = bytesToHexCompact(l4.bytes);
  const srcPort = l4.fields.find((f) => f.name === "Source Port")?.value ?? "—";
  const dstPort = l4.fields.find((f) => f.name === "Dest Port")?.value ?? "—";
  const l4Readable = `TCP Segment (20-byte header)\n  Src Port: ${srcPort} → Dst Port: ${dstPort}\n  Seq: 1000 | Ack: 0 | Flags: PSH, ACK | Window: 65535\n  [Payload: ${l5.bytes.length} bytes] → Total: ${l4.bytes.length} bytes`;
  result.push({
    layerNumber: 4,
    layerName: "Transport",
    pduName: "Segment",
    headerFields: l4.fields,
    payloadFromUpperLayer: l5Hex.slice(0, 80) + (l5Hex.length > 80 ? "…" : ""),
    inputSizeBytes: l5.bytes.length,
    pduHex: l4Hex,
    pduSizeBytes: l4.bytes.length,
    whatHappened: "TCP header (20 bytes) was added: source and destination ports, sequence and acknowledgment numbers, flags (PSH, ACK), window size, and checksum. Data became a segment.",
    humanReadable: l4Readable,
    inputHexFull: l5Hex,
    inputBinary: bytesToBinaryFormatted(l5.bytes),
    inputHumanReadable: l5Readable,
    outputBinary: bytesToBinaryFormatted(l4.bytes),
    layerDescription: LAYER_DESCRIPTIONS[4],
    protocols: LAYER_PROTOCOLS[4],
    hardware: LAYER_HARDWARE[4],
  });

  // ── Layer 3: Network ────────────────────────────────────────────────
  const l3 = buildLayer3(config, l4.bytes);
  const l3Hex = bytesToHexCompact(l3.bytes);
  const srcIP = l3.fields.find((f) => f.name === "Source IP")?.value ?? "—";
  const dstIP = l3.fields.find((f) => f.name === "Dest IP")?.value ?? "—";
  const l3Readable = `IP Packet (IPv4, 20-byte header)\n  ${srcIP}  →  ${dstIP}\n  TTL: 64 | Protocol: TCP (6) | Total length: ${l3.bytes.length} bytes`;
  result.push({
    layerNumber: 3,
    layerName: "Network",
    pduName: "Packet",
    headerFields: l3.fields,
    payloadFromUpperLayer: l4Hex.slice(0, 80) + (l4Hex.length > 80 ? "…" : ""),
    inputSizeBytes: l4.bytes.length,
    pduHex: l3Hex,
    pduSizeBytes: l3.bytes.length,
    whatHappened: "IP header (20 bytes) was added: source and destination IP addresses, TTL, protocol (TCP), total length, and header checksum. Segment became a packet for routing.",
    humanReadable: l3Readable,
    inputHexFull: l4Hex,
    inputBinary: bytesToBinaryFormatted(l4.bytes),
    inputHumanReadable: l4Readable,
    outputBinary: bytesToBinaryFormatted(l3.bytes),
    layerDescription: LAYER_DESCRIPTIONS[3],
    protocols: LAYER_PROTOCOLS[3],
    hardware: LAYER_HARDWARE[3],
  });

  // ── Layer 2: Data Link ──────────────────────────────────────────────
  const l2 = buildLayer2(config, l3.bytes);
  const l2Hex = bytesToHexCompact(l2.bytes);
  const dstMAC = l2.fields.find((f) => f.name === "Dest MAC")?.value ?? "—";
  const srcMAC = l2.fields.find((f) => f.name === "Src MAC")?.value ?? "—";
  const l2Readable = `Ethernet II Frame (14-byte header + 4-byte FCS)\n  Dst MAC: ${dstMAC}\n  Src MAC: ${srcMAC}\n  Type: 0x0800 (IPv4) | Payload: ${l3.bytes.length} bytes → Total: ${l2.bytes.length} bytes`;
  result.push({
    layerNumber: 2,
    layerName: "Data Link",
    pduName: "Frame",
    headerFields: l2.fields,
    payloadFromUpperLayer: l3Hex.slice(0, 80) + (l3Hex.length > 80 ? "…" : ""),
    inputSizeBytes: l3.bytes.length,
    pduHex: l2Hex,
    pduSizeBytes: l2.bytes.length,
    whatHappened: "Ethernet frame header (14 bytes) was added: destination and source MAC addresses, and type (0x0800 = IPv4). FCS (4 bytes) was appended for error detection. Packet became a frame.",
    humanReadable: l2Readable,
    inputHexFull: l3Hex,
    inputBinary: bytesToBinaryFormatted(l3.bytes),
    inputHumanReadable: l3Readable,
    outputBinary: bytesToBinaryFormatted(l2.bytes),
    layerDescription: LAYER_DESCRIPTIONS[2],
    protocols: LAYER_PROTOCOLS[2],
    hardware: LAYER_HARDWARE[2],
  });

  // ── Layer 1: Physical ───────────────────────────────────────────────
  const l1 = buildLayer1(l2.bytes);
  const l1Readable = `Physical layer: ${l2.bytes.length} bytes × 8 = ${l2.bytes.length * 8} bits on the wire\nFirst 8 bytes as bits:\n${l1.bitsPreview}`;
  result.push({
    layerNumber: 1,
    layerName: "Physical",
    pduName: "Bits",
    headerFields: l1.fields,
    payloadFromUpperLayer: l2Hex.slice(0, 80) + (l2Hex.length > 80 ? "…" : ""),
    inputSizeBytes: l2.bytes.length,
    pduHex: l2Hex,
    pduSizeBytes: l2.bytes.length,
    whatHappened: "Frame was converted to a stream of bits (electrical/optical/radio signals) and sent on the physical medium. No header added; the entire frame is transmitted as raw bits.",
    humanReadable: l1Readable,
    bitsPreview: l1.bitsPreview,
    inputHexFull: l2Hex,
    inputBinary: bytesToBinaryFormatted(l2.bytes),
    inputHumanReadable: l2Readable,
    outputBinary: bytesToBinaryFormatted(l2.bytes),
    layerDescription: LAYER_DESCRIPTIONS[1],
    protocols: LAYER_PROTOCOLS[1],
    hardware: LAYER_HARDWARE[1],
  });

  return result;
}

/** Format hex string for display (wrap every 2 chars, line break every N bytes) */
export function formatHexForDisplay(hex: string, bytesPerLine = 16): string {
  const pairs = hex.match(/.{2}/g) || [];
  const lines: string[] = [];
  for (let i = 0; i < pairs.length; i += bytesPerLine) {
    lines.push(pairs.slice(i, i + bytesPerLine).join(" "));
  }
  return lines.join("\n");
}

/** Convert a byte array to a formatted binary string (8 bits/byte, 4 bytes per line) */
function bytesToBinaryFormatted(bytes: number[], bytesPerLine = 4): string {
  const lines: string[] = [];
  for (let i = 0; i < bytes.length; i += bytesPerLine) {
    lines.push(
      bytes
        .slice(i, i + bytesPerLine)
        .map((b) => b.toString(2).padStart(8, "0"))
        .join(" ")
    );
  }
  return lines.join("\n");
}

/** Convert a compact hex string to a formatted binary string */
export function formatBinaryForDisplay(hex: string, bytesPerLine = 4): string {
  const bytes = (hex.match(/.{2}/g) || []).map((h) => parseInt(h, 16));
  return bytesToBinaryFormatted(bytes, bytesPerLine);
}
