export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Category = 'OSI Model' | 'TCP/IP' | 'General Networking';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: Difficulty;
  category: Category;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "Which layer of the OSI model is responsible for reliable data transfer and error recovery?",
    options: ["Network Layer", "Transport Layer", "Data Link Layer", "Session Layer"],
    correctOptionIndex: 1,
    explanation: "The Transport Layer (Layer 4) ensures complete data transfer, handling error recovery and flow control (e.g., TCP).",
    difficulty: "Medium",
    category: "OSI Model"
  },
  {
    id: "q2",
    text: "What protocol operates at the Application Layer (Layer 7)?",
    options: ["IP", "TCP", "HTTP", "Ethernet"],
    correctOptionIndex: 2,
    explanation: "HTTP (Hypertext Transfer Protocol) operates at the Application Layer, providing web communication.",
    difficulty: "Easy",
    category: "OSI Model"
  },
  {
    id: "q3",
    text: "Which of these is NOT a layer in the TCP/IP model?",
    options: ["Application", "Transport", "Session", "Internet"],
    correctOptionIndex: 2,
    explanation: "The TCP/IP model combines the OSI's Application, Presentation, and Session layers into a single Application layer.",
    difficulty: "Medium",
    category: "TCP/IP"
  },
  {
    id: "q4",
    text: "At which OSI layer do routers primarily operate?",
    options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
    correctOptionIndex: 2,
    explanation: "Routers operate at the Network Layer (Layer 3), forwarding packets between different networks using IP addresses.",
    difficulty: "Easy",
    category: "OSI Model"
  },
  {
    id: "q5",
    text: "What is the PDU (Protocol Data Unit) of the Data Link Layer?",
    options: ["Packet", "Frame", "Segment", "Bit"],
    correctOptionIndex: 1,
    explanation: "At the Data Link Layer (Layer 2), data is formatted into Frames, which include MAC addresses for local delivery.",
    difficulty: "Medium",
    category: "OSI Model"
  },
  {
    id: "q6",
    text: "Which layer handles data encryption and decryption?",
    options: ["Presentation Layer", "Session Layer", "Application Layer", "Transport Layer"],
    correctOptionIndex: 0,
    explanation: "The Presentation Layer (Layer 6) is responsible for data translation, encryption, and compression.",
    difficulty: "Hard",
    category: "OSI Model"
  },
  {
    id: "q7",
    text: "What is the primary function of the ARP protocol?",
    options: ["Resolving domain names to IP addresses", "Resolving IP addresses to MAC addresses", "Routing packets across networks", "Securing data transmission"],
    correctOptionIndex: 1,
    explanation: "ARP (Address Resolution Protocol) maps a known IP address to an unknown MAC address on a local network.",
    difficulty: "Medium",
    category: "General Networking"
  },
  {
    id: "q8",
    text: "Which transport layer protocol is connectionless and does not guarantee delivery?",
    options: ["TCP", "UDP", "IP", "ICMP"],
    correctOptionIndex: 1,
    explanation: "UDP (User Datagram Protocol) is a connectionless, best-effort protocol that prioritizes speed over reliability.",
    difficulty: "Easy",
    category: "TCP/IP"
  },
  {
    id: "q9",
    text: "In the OSI model, what does the Physical layer transmit?",
    options: ["Frames", "Packets", "Segments", "Bits"],
    correctOptionIndex: 3,
    explanation: "The Physical Layer (Layer 1) transmits raw bit streams over a physical medium (e.g., electrical signals, light).",
    difficulty: "Easy",
    category: "OSI Model"
  },
  {
    id: "q10",
    text: "Which protocol is primarily used to test reachability and measure round-trip time?",
    options: ["HTTP", "DNS", "ICMP", "ARP"],
    correctOptionIndex: 2,
    explanation: "ICMP (Internet Control Message Protocol) is used by tools like 'ping' to test reachability and diagnostics.",
    difficulty: "Medium",
    category: "General Networking"
  }
];
