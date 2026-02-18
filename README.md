<div align="center">

![App Logo](public/Favicon.svg)

# OSI Model Simulator

[![AGPL License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-Latest-orange.svg)](https://www.rust-lang.org/)

**An interactive app that simulates the OSI model and shows how messages travel through all seven layers—from application to physical**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage-guide) • [Contributing](#-contributing) • [Support](#-support)

---

</div>

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Building for Production](#-building-for-production)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [Code of Conduct](#-code-of-conduct)
- [Support](#-support)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [About Roboticela](#-about-roboticela)

---

## 🌟 About

**OSI Model Simulator** is a modern, cross-platform application that helps you understand how data travels through the seven layers of the OSI (Open Systems Interconnection) model. Built with Tauri, React, and TypeScript, it provides an interactive, step-by-step simulation of message encapsulation and de-encapsulation across Application, Presentation, Session, Transport, Network, Data Link, and Physical layers.

Whether you're learning networking, teaching the OSI model, or exploring how TCP/IP and data encapsulation work, this simulator offers a clear visual and educational experience.

### Why This Project?

- ✅ **Free and Open Source** - Licensed under AGPL-3.0
- ✅ **Cross-Platform** - Works on Linux, Windows, macOS, and runs in the browser
- ✅ **Fast & Lightweight** - Built with Tauri and Rust for desktop; Vite for web
- ✅ **Interactive Simulation** - Step through each layer with detailed data and protocols
- ✅ **Modern & Legacy UI** - New app layout plus optional legacy version
- ✅ **Educational** - Learn protocols, headers, and processes at each layer
- ✅ **Theme Support** - Multiple themes including light, dark, navy, ocean, and more
- ✅ **Actively Maintained** - Regular updates and community support

---

## ✨ Features

### 📡 OSI Layers Simulation
- **All Seven Layers** - Application, Presentation, Session, Transport, Network, Data Link, Physical
- **Encapsulation & De-encapsulation** - Watch data move down (sending) and up (receiving)
- **Protocols & Processes** - See which protocols and processes apply at each layer
- **TCP Three-Way Handshake** - Connection setup visualization at the Transport layer
- **Transmission Media** - Choose copper cable, optical fiber, or wireless and see timing differences

### 🎯 Main App
- **Simulation Settings** - Message input, animation speed, transmission medium
- **Live Visualization** - Step-by-step view with layer-by-layer data transformation
- **Theme Picker** - Multiple themes (Navy, Dark, Light, Sunset, Ocean, Forest, Purple, Midnight)
- **Story / How it works** - Built-in guidance and about/license modals
- **Banner to Legacy** - One-click access to the legacy version (dismissible)

### 📜 Legacy Version
- **Classic Layout** - Full-page layout with animated title and gradient background
- **Standalone Simulator** - In-depth OSI simulation with manual or auto-step mode
- **Banner to Main App** - Easy return to the main application
- **Dedicated Favicon** - LegacyFavicon.svg for the legacy experience

### 🎨 General
- **Responsive Design** - Works on different screen sizes
- **Smooth Animations** - Powered by Framer Motion
- **Desktop or Web** - Run as Tauri desktop app or in the browser

---

## 🛠️ Technology Stack

### Frontend
- **[React 19](https://reactjs.org/)** - UI library
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animations
- **[React Router 7](https://reactrouter.com/)** - Client-side routing (main app + legacy)
- **[Lucide React](https://lucide.dev/)** - Icons
- **[Vite 7](https://vitejs.dev/)** - Build tool

### Backend
- **[Tauri 2](https://tauri.app/)** - Desktop application framework
- **[Rust](https://www.rust-lang.org/)** - Systems programming language

### Development Tools
- **npm** - Package manager
- **ESLint** - Linting
- **TypeScript ESLint** - TypeScript linting

---

## 📋 Prerequisites

Before installing, ensure you have the following:

> 💡 **For detailed installation instructions and complete dependency lists, see [INSTALL_DEPENDENCIES.md](INSTALL_DEPENDENCIES.md)**

### Required Software

1. **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
2. **Rust** (latest stable) - [Install](https://www.rust-lang.org/tools/install)
3. **npm** - Node package manager

### System Dependencies

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

#### Linux (Fedora)
```bash
sudo dnf check-update
sudo dnf install webkit2gtk4.1-devel \
  openssl-devel \
  curl \
  wget \
  file \
  libappindicator-gtk3-devel \
  librsvg2-devel
```

#### Linux (Arch)
```bash
sudo pacman -Syu
sudo pacman -S webkit2gtk \
  base-devel \
  curl \
  wget \
  file \
  openssl \
  appmenu-gtk-module \
  gtk3 \
  libappindicator-gtk3 \
  librsvg
```

#### macOS
```bash
xcode-select --install
```

#### Windows
- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (usually pre-installed on Windows 10/11)

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Roboticela/OSI-Model-Simulator.git
cd OSI-Model-Simulator
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

### 3. Build Rust Dependencies (for desktop)

```bash
cd src-tauri
cargo build
cd ..
```

---

## 🚀 Running the Application

### Development Mode (Desktop)

Run the Tauri app with hot-reload:

```bash
npm run tauri dev
```

This will start the Vite dev server and run the desktop application.

### Web Only (Browser)

To run the frontend in the browser without Tauri:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

---

## 📦 Building for Production

### Prerequisites

Before building for production, ensure you have:

1. **All dependencies installed** - See [INSTALL_DEPENDENCIES.md](INSTALL_DEPENDENCIES.md) for detailed platform-specific setup
2. **Node.js 20+** and **npm** installed
3. **Rust** and **Cargo** installed
4. **Platform-specific build tools** (WebKit2GTK for Linux, MSVC for Windows, Xcode for macOS)

To verify your setup:
```bash
node --version
npm --version
rustc --version
cargo --version
```

### Quick Build (Current Platform)

Build for your current platform:

```bash
npm run build
npm run tauri build
```

Or use the combined script:

```bash
npm run build:desktop
```

This will build the frontend, compile the Rust backend, bundle with Tauri, and generate platform-specific installers.

### Build Output Locations

**Desktop builds:**
```
src-tauri/target/release/          # Executables
src-tauri/target/release/bundle/   # Installers
```

### Advanced Build Options

#### Debug Build (Faster, Larger, with Debug Symbols)
```bash
npm run tauri build -- --debug
```

#### Release Build with Optimizations (Default)
```bash
npm run tauri build
```

### 🔐 Code Signing and Checksums

Builds can generate SHA256 checksums for integrity verification:

```bash
npm run build:desktop   # Build and generate checksums
npm run checksums      # Generate checksums only
npm run verify        # Verify checksums
```

For detailed code signing and notarization, see [SIGNING.md](SIGNING.md).

### Build Troubleshooting

**Frontend build fails:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Rust compilation errors:**
```bash
rustup update
cd src-tauri && cargo clean && cd ..
```

**Missing dependencies:** See [INSTALL_DEPENDENCIES.md](INSTALL_DEPENDENCIES.md).

### Production Build Checklist

Before releasing:

- [ ] Update version in `package.json` and `src-tauri/tauri.conf.json`
- [ ] Test in development mode
- [ ] Run `npm run tauri build` for target platforms
- [ ] Verify checksums if applicable
- [ ] Test installers on target platforms
- [ ] Run `npm audit` and `cargo audit`

---

## 📚 Usage Guide

### Getting Started

1. **Launch the App** - Run `npm run tauri dev` or `npm run dev` and open the app.
2. **Main App** - Use the simulation settings (left) to enter a message and choose options.
3. **Run Simulation** - Start sending to see data move through the seven OSI layers step by step.
4. **Navigate** - Use the visualization (right) to step forward/back and see encapsulation and de-encapsulation.
5. **Legacy Version** - Use the top banner link or header menu to open the legacy simulator, then use its banner to return to the main app.

### Main App Simulation

- **Message** - Enter the text you want to “send” through the OSI layers.
- **Transmission medium** - Affects how the physical layer is visualized and timing.
- **Animation speed** - Control how fast steps advance.
- **Steps** - Move through each layer on the sender side, then across the medium, then back up on the receiver side.

### Legacy Simulator

- **Manual or auto-step** - Advance with buttons/arrow keys or let it auto-step.
- **Step delay** - In auto mode, set the delay between steps.
- **Detailed view** - Toggle between simplified and detailed layer information.
- **Transmission media** - Copper cable, optical fiber, or wireless with different speeds and visuals.

### Routes

- **/** - Main application (simulation settings + visualization).
- **/legacy** - Legacy full-page OSI simulator.

---

## 📁 Project Structure

```
OSI-Model-Simulator/
│
├── src/                          # React frontend source
│   ├── components/               # React components
│   │   ├── AppHeader.tsx         # Header with theme and menu
│   │   ├── OSIInputForm.tsx      # Simulation settings form
│   │   ├── OSIVisualization.tsx  # Main OSI layer visualization
│   │   ├── ThemeScript.tsx       # Theme initialization
│   │   ├── AboutModal.tsx        # About modal
│   │   ├── LicenseModal.tsx      # License modal
│   │   ├── StoryModal.tsx        # How it works / story
│   │   ├── SignalVisualization.tsx
│   │   ├── ui/                   # UI primitives (button, dropdown)
│   │   └── lagacy/               # Legacy version components
│   │       ├── OSISimulator.tsx  # Legacy simulator
│   │       ├── AnimatedTitle.tsx
│   │       ├── ThemeToggle.tsx
│   │       ├── OSILayer.tsx
│   │       ├── TransmissionMedia.tsx
│   │       └── ...
│   │
│   ├── contexts/
│   │   ├── OSISimulatorContext.tsx  # Simulation state
│   │   ├── ThemeContext.tsx        # Theme state
│   │   └── HeaderVisibilityContext.tsx
│   │
│   ├── pages/
│   │   └── LegacyPage.tsx        # Legacy route page
│   │
│   ├── lib/                      # Utilities
│   │   ├── osiSimulation.ts      # OSI simulation logic
│   │   ├── tauri.ts              # Tauri helpers
│   │   └── utils.ts
│   │
│   ├── utils/lagacy/             # Legacy utilities
│   │   ├── osiUtils.ts
│   │   └── themeUtils.ts
│   │
│   ├── types/
│   │   └── osi.ts                # OSI-related types
│   │
│   ├── App.tsx                   # Main app component
│   ├── App.css                   # Global styles
│   └── main.tsx                 # Entry point + router
│
├── src-tauri/                    # Tauri/Rust backend
│   ├── src/
│   │   ├── main.rs
│   │   └── lib.rs
│   ├── icons/                    # App icons
│   ├── capabilities/
│   ├── Cargo.toml
│   ├── build.rs
│   └── tauri.conf.json
│
├── public/                       # Public static assets
│   ├── Favicon.svg
│   └── LagacyFavicon.svg
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── LICENSE                       # AGPL-3.0
├── INSTALL_DEPENDENCIES.md
├── SIGNING.md
└── README.md
```

---

## ⚙️ Configuration

### Tauri Configuration

The `src-tauri/tauri.conf.json` file contains Tauri settings: app identifier, version, window size and title, capabilities, and bundle options. Modify it to change desktop app behavior.

### Environment Variables

No environment variables are required for normal use. Configuration is done through the UI.

---

## 🤝 Contributing

We welcome contributions! Whether it's bug fixes, features, docs, or feedback, every bit helps.

### Ways to Contribute

1. **Report Bugs** - Open an issue with steps to reproduce and environment details.
2. **Suggest Features** - Share ideas for new features or improvements.
3. **Write Code** - Submit pull requests for bugs or features.
4. **Improve Documentation** - Help keep the README and docs clear and up to date.
5. **Share the Project** - Star the repo and tell others.

### Getting Started with Development

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/OSI-Model-Simulator.git
   cd OSI-Model-Simulator
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Changes** - Follow existing style, add tests where relevant, and test locally.

4. **Commit**
   ```bash
   git add .
   git commit -m "Add: brief description"
   ```
   Prefixes: `Add:` `Fix:` `Update:` `Docs:` `Style:` `Refactor:` `Test:` `Chore:`

5. **Push and Open a PR**
   ```bash
   git push origin feature/your-feature
   ```
   Then open a Pull Request on GitHub with a clear description and any related issues.

### Code Style

- **Frontend** - Functional components, TypeScript, TailwindCSS, React best practices.
- **Rust** - `cargo fmt`, `cargo clippy`, clear error handling, doc comments for public APIs.

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior:** Respectful and inclusive communication, patience with newcomers, accepting constructive criticism, focusing on the community’s best interest, empathy.

**Unacceptable behavior:** Harassment, trolling, derogatory comments, personal or political attacks, publishing others’ private information, or any conduct inappropriate in a professional setting.

### Enforcement

Reports of unacceptable behavior will be reviewed and addressed by the maintainers. Maintainers may remove, edit, or reject comments, commits, code, and other contributions that violate this Code of Conduct.

---

## 💬 Support

### GitHub Issues

For bugs, feature requests, or technical questions:

🐛 **[Open an Issue](https://github.com/Roboticela/OSI-Model-Simulator/issues)**

When reporting a bug, please include:
- OS and version
- App version (or commit)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots or error messages if helpful

### Community

- 🐙 **GitHub**: [Roboticela/OSI-Model-Simulator](https://github.com/Roboticela/OSI-Model-Simulator)
- ⭐ **Star the repo** to show your support.

### FAQ

**Q: Is this free to use?**  
A: Yes. It’s open-source under the AGPL-3.0 license.

**Q: Can I use it commercially?**  
A: Yes, subject to AGPL-3.0. If you distribute or run a modified version over a network, you must make the source available under AGPL-3.0.

**Q: Web only or desktop too?**  
A: Both. Use `npm run dev` for web or `npm run tauri dev` / built installer for desktop.

**Q: What’s the difference between main app and legacy?**  
A: Main app is the new layout (settings + visualization). Legacy is the classic full-page simulator with its own UI and flow.

**Q: How do I report a security issue?**  
A: Open a GitHub issue or contact the maintainers directly.

---

## 🗺️ Roadmap

### Possible Future Improvements

- [ ] **Export / Share** - Export simulation state or shareable links
- [ ] **More Protocols** - Deeper protocol examples at each layer
- [ ] **Quizzes / Exercises** - Simple quizzes to reinforce OSI concepts
- [ ] **i18n** - Multiple languages for the UI
- [ ] **Accessibility** - Enhanced keyboard and screen reader support

### Version History

**v0.1.0** (Current)
- Main app: simulation settings + OSI visualization
- Legacy route with full-page simulator
- Multiple themes
- Tauri desktop support
- React Router for main and legacy

See [Releases](https://github.com/Roboticela/OSI-Model-Simulator/releases) for the full changelog.

---

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### What This Means

✅ **You CAN:**
- Use the software for any purpose
- Study, modify, and distribute it
- Use it commercially (under the license terms)

⚠️ **You MUST:**
- Disclose source when distributing
- Include the license and copyright notice
- State changes made
- License modifications under AGPL-3.0
- If you run a modified version over a network, provide source access to users

❌ **You CANNOT:**
- Hold the authors liable for damages
- Use the authors’ names for endorsement without permission

**Full License Text:** See the [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

Thanks to the open-source projects and communities that make this possible:

### Core Technologies
- **[Tauri](https://tauri.app/)** - Desktop framework
- **[React](https://reactjs.org/)** - UI library
- **[Rust](https://www.rust-lang.org/)** - Performance and safety
- **[Vite](https://vitejs.dev/)** - Build tooling

### Libraries & Tools
- **[TailwindCSS](https://tailwindcss.com/)** - Styling
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[React Router](https://reactrouter.com/)** - Routing
- **[Lucide React](https://lucide.dev/)** - Icons
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

---

## 🏢 About Roboticela

<div align="center">

<img src="src/assets/CompanyLogo.png" alt="Roboticela Logo" width="200" style="padding:30px;" />

**[Roboticela](https://github.com/Roboticela)** builds high-quality, open-source software for developers and learners.

</div>

### Our Mission

To create accessible, privacy-conscious software that supports learning and open collaboration.

### This Project

**OSI Model Simulator** is developed and maintained by Roboticela. We focus on:

- 🔓 **Open Source** - Transparent, community-friendly development
- 🔒 **Privacy** - No tracking of users beyond optional analytics you can control
- 🚀 **Modern Stack** - Tauri, React, TypeScript
- 🌍 **Education** - Clear explanation of the OSI model and networking concepts

### Get in Touch

- 🐙 **GitHub**: [github.com/Roboticela](https://github.com/Roboticela)
- 📧 **Email**: contact@roboticela.com
- 🔗 **Repository**: [github.com/Roboticela/OSI-Model-Simulator](https://github.com/Roboticela/OSI-Model-Simulator)

### Support Roboticela

- ⭐ Star our repositories
- 🐛 Report bugs and suggest features
- 🤝 Contribute code or documentation
- 📣 Share the project with others

---

<div align="center">

## 💖 Thank You!

Thanks for using **OSI Model Simulator**. We hope it helps you understand the OSI model and how data moves through the internet.

**Built with ❤️ by [Roboticela](https://github.com/Roboticela)**

© 2025 Roboticela. Licensed under AGPL-3.0.

---

⭐ **If you find this project useful, please consider giving it a star on GitHub!** ⭐

[⬆ Back to Top](#-osi-model-simulator)

</div>
