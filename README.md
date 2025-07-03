# OSI Model Simulator

<div align="center">
  
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4)

  <img src="public/favicon.svg" alt="OSI Model Simulator Logo" width="150" />
  
  <h1>Interactive OSI Model Learning Platform</h1>
  
  <p align="center">
    <strong>A comprehensive, interactive simulation of the OSI (Open Systems Interconnection) model</strong><br>
    Visualize how data travels through each of the seven layers with detailed animations and explanations
  </p>
  
  <a href="https://roboticela.com"><strong>Explore Roboticela »</strong></a>
  
  <br>
  <br>
  
  <a href="#demo">View Demo</a>
  ·
  <a href="#installation">Installation</a>
  ·
  <a href="#usage">Usage</a>
  ·
  <a href="#contributing">Contributing</a>
  
</div>

<br>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [OSI Layers Explained](#-osi-layers-explained)
- [Key Processes Simulated](#-key-processes-simulated)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [Technologies](#-technologies)
- [Educational Purpose](#-educational-purpose)
- [Project Structure](#-project-structure)
- [Learn More](#-learn-more)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [About Roboticela](#-about-roboticela)

<br>

## 🌟 Overview

The OSI Model Simulator is an interactive educational tool designed to help users understand the complex concepts of the OSI (Open Systems Interconnection) reference model. By providing visual representations and step-by-step simulations, this application makes networking concepts more accessible and engaging for students, professionals, and enthusiasts alike.

<br>

## ✨ Features

- **📊 Interactive Visualization** - Watch in real-time how your message is processed through each of the seven OSI layers with detailed animations
- **📝 Comprehensive Layer Information** - Explore detailed explanations of protocols, headers, and processes at each layer with interactive tooltips
- **↔️ Bidirectional Data Flow** - Follow complete data transmission paths from sender to receiver and back with packet tracing
- **🎓 Rich Educational Content** - Access in-depth explanations about the OSI model, its importance in networking, and real-world applications
- **🔄 Protocol Simulation** - Experience realistic simulations of common networking protocols at each layer
- **📱 Responsive Design** - Enjoy a seamless experience across desktop, tablet, and mobile devices
- **🎨 Customizable Scenarios** - Create and modify network scenarios to observe different behaviors and outcomes

<br>

## 🔍 OSI Layers Explained

The simulator provides detailed information about all seven layers of the OSI model:

<table align="center">
  <thead>
    <tr>
      <th align="center">Layer</th>
      <th align="center">Name</th>
      <th align="center">Function</th>
      <th align="center">Protocols</th>
      <th align="center">Data Unit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center"><strong>7</strong></td>
      <td align="center"><strong>Application</strong></td>
      <td>Provides network services directly to end-users and applications</td>
      <td>HTTP, SMTP, FTP, DNS, DHCP</td>
      <td>Data</td>
    </tr>
    <tr>
      <td align="center"><strong>6</strong></td>
      <td align="center"><strong>Presentation</strong></td>
      <td>Translates, encrypts, and compresses data for the application layer</td>
      <td>SSL/TLS, JPEG, MPEG, ASCII</td>
      <td>Data</td>
    </tr>
    <tr>
      <td align="center"><strong>5</strong></td>
      <td align="center"><strong>Session</strong></td>
      <td>Establishes, manages, and terminates sessions between applications</td>
      <td>NetBIOS, RPC, SOCKS</td>
      <td>Data</td>
    </tr>
    <tr>
      <td align="center"><strong>4</strong></td>
      <td align="center"><strong>Transport</strong></td>
      <td>Provides reliable data transfer, segmentation, and flow control</td>
      <td>TCP, UDP, SCTP</td>
      <td>Segment</td>
    </tr>
    <tr>
      <td align="center"><strong>3</strong></td>
      <td align="center"><strong>Network</strong></td>
      <td>Routes data packets between different networks and handles addressing</td>
      <td>IP, ICMP, OSPF, BGP</td>
      <td>Packet</td>
    </tr>
    <tr>
      <td align="center"><strong>2</strong></td>
      <td align="center"><strong>Data Link</strong></td>
      <td>Provides node-to-node data transfer and error detection on the physical layer</td>
      <td>Ethernet, PPP, ARP, VLAN</td>
      <td>Frame</td>
    </tr>
    <tr>
      <td align="center"><strong>1</strong></td>
      <td align="center"><strong>Physical</strong></td>
      <td>Transmits raw bit stream over physical medium and handles hardware specifications</td>
      <td>USB, Bluetooth, IEEE 802.11</td>
      <td>Bit</td>
    </tr>
  </tbody>
</table>

<br>

## 🚀 Key Processes Simulated

The simulator provides detailed visualizations of key networking processes:

- **Data Encapsulation & Decapsulation**: 
  Observe how each layer adds its own headers/trailers during transmission and removes them during reception, transforming data as it moves through the stack

- **Connection Establishment**: 
  Visualize the TCP three-way handshake process with detailed sequence diagrams and explanations of SYN, SYN-ACK, and ACK packets

- **Routing & Switching**: 
  See how packets are routed through networks using various algorithms and how switches make forwarding decisions based on MAC addresses

- **Error Detection & Correction**: 
  Learn about error detection mechanisms like checksums, CRC, and parity bits, and see how protocols handle packet loss and corruption

- **Protocol Operations**: 
  Understand the specific operations of protocols at each layer with detailed protocol state machines and message exchanges

- **Fragmentation & Reassembly**:
  Observe how large packets are broken down into smaller fragments for transmission and reassembled at the destination

<br>

## 🛠️ Installation

Follow these steps to set up the OSI Model Simulator locally:

```bash
# Clone the repository
git clone https://github.com/Roboticela/osi-model-simulator.git

# Navigate to the project directory
cd osi-model-simulator

# Install dependencies
npm install

# Run the development server
npm run dev
```

Once the development server is running, open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

### Prerequisites

- Node.js 18.0 or later
- npm 9.0 or later

<br>

## 🖱️ Usage

1. **Start the Simulator**: Navigate to the main page and click on "Start Simulation"
2. **Enter a Message**: Type the message you want to send through the OSI layers
3. **Configure Options**: Select the protocols and options for each layer
4. **Run Simulation**: Click "Send Message" to start the simulation
5. **Observe the Process**: Watch as your message travels through each layer
6. **Explore Details**: Click on any layer to see detailed information about the processes occurring

<br>

## 💻 Technologies

This project leverages modern web technologies to provide a seamless and interactive experience:

- **Next.js**: React framework for server-rendered applications, providing optimal performance and SEO benefits
- **React**: JavaScript library for building dynamic and responsive user interfaces with reusable components
- **TypeScript**: Strongly typed programming language that builds on JavaScript, adding static type definitions
- **Tailwind CSS**: Utility-first CSS framework for creating custom designs without leaving your HTML

<br>

## 🎯 Educational Purpose

The OSI Model Simulator is designed with education at its core. It serves as a valuable resource for:

- **Students** learning networking fundamentals in computer science and IT courses
- **Educators** teaching network architecture and communication protocols
- **IT Professionals** refreshing their knowledge of networking concepts
- **Certification Candidates** preparing for networking certifications like CompTIA Network+, CCNA, etc.

The interactive nature of the simulator makes complex networking concepts more accessible and easier to understand through visual learning and hands-on experimentation.

<br>

## 📁 Project Structure

```
osi-model-simulator/
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   │   ├── OSILayer.tsx # Individual OSI layer component
│   │   └── ...
│   └── utils/           # Utility functions
├── public/              # Static assets
└── ...
```

<br>

## 📚 Learn More

Expand your knowledge with these resources:

- [OSI Model (Wikipedia)](https://en.wikipedia.org/wiki/OSI_model) - Comprehensive overview of the OSI model
- [TCP/IP vs OSI Model](https://www.geeksforgeeks.org/tcp-ip-model/) - Understanding the differences between models
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev/) - Explore React concepts and tutorials

<br>

## 🚀 Deployment

The application can be easily deployed on [Vercel](https://vercel.com) or any other hosting platform that supports Next.js applications.

```bash
# Build for production
npm run build

# Start production server
npm start
```

For detailed deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

<br>

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute to this project:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

<br>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<br>

## 🏢 About Roboticela

<div align="center">
  <img src="https://via.placeholder.com/150x50?text=Roboticela" alt="Roboticela Logo" width="150" />
</div>

<br>

Roboticela is a forward-thinking technology company specializing in educational software and interactive simulations. Our mission is to make complex technical concepts accessible and engaging for learners at all levels through innovative digital experiences.

Our team combines expertise in software development, educational design, and subject matter knowledge to create tools that transform how people learn technical subjects.

Visit [Roboticela](https://roboticela.com) for more educational tools and resources.
