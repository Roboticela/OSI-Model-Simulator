# OSI Model Simulator

A detailed, interactive simulation of the OSI (Open Systems Interconnection) model that demonstrates how data travels through each of the seven layers.

## Features

- **Step-by-Step Visualization**: See how your message is processed through each of the seven OSI layers
- **Detailed Layer Information**: Learn about protocols, headers, and processes at each layer
- **Bidirectional Simulation**: Follow data flow from sender to receiver and back
- **Educational Content**: Learn about the OSI model and its importance in networking

## OSI Layers Explained

The simulator covers all seven layers of the OSI model:

1. **Physical Layer**: Transmits raw bit stream over physical medium
2. **Data Link Layer**: Provides node-to-node data transfer and error detection
3. **Network Layer**: Routes data packets between networks
4. **Transport Layer**: Provides reliable data transfer and flow control
5. **Session Layer**: Establishes, manages, and terminates sessions
6. **Presentation Layer**: Translates, encrypts, and compresses data
7. **Application Layer**: Provides network services to applications

## Key Processes Simulated

- **Data Encapsulation**: See how each layer adds its own headers/trailers
- **Connection Establishment**: Visualize the TCP three-way handshake
- **Routing**: See how packets are routed through networks
- **Error Detection**: Learn about error detection mechanisms
- **Protocol Operations**: Understand the protocols operating at each layer

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS

## Educational Purpose

This simulator is designed for educational purposes to help students, developers, and networking enthusiasts understand the OSI model in a visual, interactive way.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
