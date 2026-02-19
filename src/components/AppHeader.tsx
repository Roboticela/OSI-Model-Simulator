"use client";

import { useTheme, type ThemeName } from "../contexts/ThemeContext";
import StoryModal from "../components/StoryModal";
import AboutModal from "../components/AboutModal";
import LicenseModal from "../components/LicenseModal";
import {
  Palette,
  Menu,
  ChevronDown,
  BookOpen,
  Info,
  Github,
  FileText,
  Shield,
  Scale,
  HelpCircle,
  RotateCcw,
  Layers,
  Wifi,
  Globe,
  Gauge,
  Timer,
  Cable,
  Lightbulb,
  Plug,
  Radio,
  Lock,
  LockOpen,
  Mail,
  Server,
  FolderInput,
  Clock,
  Zap,
  Repeat,
  History,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { TransmissionMedium, ProtocolType, AnimationSpeed } from "../types/osi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
} from "../components/ui/dropdown-menu";
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { openLink } from "../lib/tauri";
import { useOSISimulator } from "../contexts/OSISimulatorContext";

const themes: { name: ThemeName; label: string; colors: string }[] = [
  { name: "navy", label: "Navy", colors: "bg-blue-900" },
  { name: "dark", label: "Dark", colors: "bg-gray-900" },
  { name: "light", label: "Light", colors: "bg-gray-100" },
  { name: "sunset", label: "Sunset", colors: "bg-orange-500" },
  { name: "ocean", label: "Ocean", colors: "bg-cyan-500" },
  { name: "forest", label: "Forest", colors: "bg-green-700" },
  { name: "purple", label: "Purple Dream", colors: "bg-purple-600" },
  { name: "midnight", label: "Midnight", colors: "bg-indigo-900" },
];

const MEDIUM_OPTIONS: { value: TransmissionMedium; label: string; Icon: LucideIcon }[] = [
  { value: "ethernet", label: "Ethernet", Icon: Cable },
  { value: "wifi", label: "Wi-Fi", Icon: Wifi },
  { value: "fiber", label: "Fiber", Icon: Lightbulb },
  { value: "coaxial", label: "Coaxial", Icon: Plug },
  { value: "radio", label: "Radio", Icon: Radio },
];

const PROTOCOL_OPTIONS: { value: ProtocolType; label: string; Icon: LucideIcon }[] = [
  { value: "https", label: "HTTPS", Icon: Lock },
  { value: "http", label: "HTTP", Icon: LockOpen },
  { value: "smtp", label: "SMTP", Icon: Mail },
  { value: "dns", label: "DNS", Icon: Server },
  { value: "ftp", label: "FTP", Icon: FolderInput },
];

const SPEED_OPTIONS: { value: AnimationSpeed; label: string; Icon: LucideIcon }[] = [
  { value: "slow", label: "Slow", Icon: Clock },
  { value: "normal", label: "Normal", Icon: Gauge },
  { value: "fast", label: "Fast", Icon: Zap },
];

const HEADER_BUTTON_IDS = ["medium", "protocol", "auto", "repeat", "speed", "reset", "theme"] as const;
const MOBILE_BREAKPOINT_PX = 768;
const HIDE_ON_MOBILE_IDS = ["auto", "repeat", "speed"];

export default function AppHeader() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { config, setConfig, reset } = useOSISimulator();
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [licenseModalOpen, setLicenseModalOpen] = useState(false);
  const [menuButtons, setMenuButtons] = useState<string[]>([]);

  const headerRef = useRef<HTMLElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLDivElement>(null);

  const currentTheme = themes.find((t) => t.name === theme);
  const currentMediumOption = MEDIUM_OPTIONS.find((o) => o.value === config.medium);
  const currentProtocolOption = PROTOCOL_OPTIONS.find((o) => o.value === config.protocol);
  const currentSpeedOption = SPEED_OPTIONS.find((o) => o.value === config.speed);
  const MediumIcon = currentMediumOption?.Icon ?? Wifi;
  const ProtocolIcon = currentProtocolOption?.Icon ?? Globe;
  const SpeedIcon = currentSpeedOption?.Icon ?? Gauge;

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const adjustVisibleButtons = useCallback(() => {
    if (!headerRef.current || !buttonsContainerRef.current) return;

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT_PX;
    const headerWidth = headerRef.current.offsetWidth;
    const leftWidth = leftSectionRef.current?.offsetWidth ?? 200;
    const padding = 32;
    const sectionGap = 16;
    const gap = 8;
    const menuWidth = menuButtonRef.current?.offsetWidth ?? 80;
    const menuGap = 8;
    let available = headerWidth - leftWidth - menuWidth - padding - sectionGap - menuGap;

    const container = buttonsContainerRef.current;
    const buttonEls = Array.from(container.children) as HTMLElement[];

    buttonEls.forEach((el, i) => {
      if (i >= HEADER_BUTTON_IDS.length) return;
      if (isMobile && HIDE_ON_MOBILE_IDS.includes(HEADER_BUTTON_IDS[i])) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
    });
    void container.offsetHeight;

    let total = 0;
    const widths: number[] = [];
    buttonEls.forEach((el, i) => {
      if (i >= HEADER_BUTTON_IDS.length) return;
      const w = el.offsetWidth + (i > 0 ? gap : 0);
      widths.push(el.offsetWidth);
      total += w;
    });

    if (total <= available) {
      setMenuButtons([]);
      return;
    }

    let current = 0;
    const overflow: string[] = [];
    buttonEls.forEach((el, i) => {
      if (i >= HEADER_BUTTON_IDS.length) return;
      const id = HEADER_BUTTON_IDS[i];
      if (isMobile && HIDE_ON_MOBILE_IDS.includes(id)) return;
      const w = widths[i] + (i > 0 ? gap : 0);
      if (current + w <= available) {
        current += w;
      } else {
        el.style.display = "none";
        overflow.push(id);
      }
    });
    setMenuButtons(overflow);
  }, []);

  useEffect(() => {
    const t = setTimeout(adjustVisibleButtons, 100);
    const onResize = () => setTimeout(adjustVisibleButtons, 100);
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [adjustVisibleButtons]);

  useEffect(() => {
    const t = setTimeout(adjustVisibleButtons, 100);
    return () => clearTimeout(t);
  }, [theme, config.medium, config.protocol, config.speed, adjustVisibleButtons]);

  return (
    <>
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full h-14 border-b border-border/40 bg-card/40 backdrop-blur-md flex items-center px-4 gap-2 overflow-hidden"
      >
        <motion.div
          ref={leftSectionRef}
          className="flex items-center gap-3 flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <Layers className="w-8 h-8 text-primary" strokeWidth={2} />
          </motion.div>
          <motion.h1
            className="text-lg font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <span className="sm:hidden">OSI Sim</span>
            <span className="hidden sm:inline">OSI Model Simulator</span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="flex items-center gap-2 flex-1 justify-end min-w-0 ml-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div ref={buttonsContainerRef} className="flex items-center gap-2">
          <div data-button-id="medium">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap"
                >
                  <MediumIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">{currentMediumOption?.label ?? "Medium"}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <AnimatePresence>
                {MEDIUM_OPTIONS.map((opt, index) => {
                  const Icon = opt.Icon;
                  return (
                    <motion.div
                      key={opt.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <DropdownMenuItem
                        onClick={() => setConfig({ medium: opt.value })}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{opt.label}</span>
                        {config.medium === opt.value && <span className="ml-auto text-primary">✓</span>}
                      </DropdownMenuItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          <div data-button-id="protocol">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap"
                >
                  <ProtocolIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">{currentProtocolOption?.label ?? "Protocol"}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <AnimatePresence>
                {PROTOCOL_OPTIONS.map((opt, index) => {
                  const Icon = opt.Icon;
                  return (
                    <motion.div
                      key={opt.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <DropdownMenuItem
                        onClick={() => setConfig({ protocol: opt.value })}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{opt.label}</span>
                        {config.protocol === opt.value && <span className="ml-auto text-primary">✓</span>}
                      </DropdownMenuItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          <div data-button-id="auto">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 rounded-xl h-10 px-4 whitespace-nowrap",
                (config.autoAnimate ?? false) && "bg-primary/10 border-primary"
              )}
              onClick={() => setConfig({ autoAnimate: !(config.autoAnimate ?? false) })}
            >
              <Timer className="w-4 h-4" />
              <span className="hidden lg:inline">Auto</span>
            </Button>
          </motion.div>
          </div>
          <div data-button-id="repeat">

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-2 rounded-xl h-10 px-4 whitespace-nowrap",
                (config.autoRepeat ?? false) && "bg-primary/10 border-primary"
              )}
              onClick={() => setConfig({ autoRepeat: !(config.autoRepeat ?? false) })}
              disabled={!(config.autoAnimate ?? false)}
            >
              <Repeat className="w-4 h-4" />
              <span className="hidden lg:inline">Repeat</span>
            </Button>
          </motion.div>
          </div>
          <div data-button-id="speed">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap"
                  disabled={!(config.autoAnimate ?? false)}
                >
                  <SpeedIcon className="w-4 h-4" />
                  <span className="hidden lg:inline">{currentSpeedOption?.label ?? "Speed"}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <AnimatePresence>
                {SPEED_OPTIONS.map((opt, index) => {
                  const Icon = opt.Icon;
                  return (
                    <motion.div
                      key={opt.value}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <DropdownMenuItem
                        onClick={() => setConfig({ speed: opt.value })}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{opt.label}</span>
                        {config.speed === opt.value && <span className="ml-auto text-primary">✓</span>}
                      </DropdownMenuItem>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          <div data-button-id="reset">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden lg:inline">Reset</span>
            </Button>
          </motion.div>
          </div>
          <div data-button-id="theme">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap">
                  <Palette className="w-4 h-4" />
                  <span className="hidden lg:inline">{currentTheme?.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <AnimatePresence>
                {themes.map((t, index) => (
                  <motion.div
                    key={t.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <DropdownMenuItem
                      onClick={() => setTheme(t.name)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div className={cn("w-6 h-6 rounded", t.colors)} />
                      <span>{t.label}</span>
                      {theme === t.name && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          </div>
          <div ref={menuButtonRef}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.2 }}>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 px-4 whitespace-nowrap">
                  <Menu className="w-4 h-4" />
                  <span className="hidden lg:inline">Menu</span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              {menuButtons.length > 0 && (
                <>
                  {menuButtons.includes("medium") && (
                    <DropdownMenuItem className="flex items-center gap-3 cursor-pointer" hasSubmenu>
                      <MediumIcon className="w-4 h-4" />
                      <span>Medium</span>
                      <DropdownMenuSub>
                        <DropdownMenuSubContent className="w-48 rounded-xl">
                          {MEDIUM_OPTIONS.map((opt) => {
                            const Icon = opt.Icon;
                            return (
                              <DropdownMenuItem
                                key={opt.value}
                                onClick={() => setConfig({ medium: opt.value })}
                                className="flex items-center gap-3 cursor-pointer"
                              >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{opt.label}</span>
                                {config.medium === opt.value && <span className="ml-auto text-primary">✓</span>}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuItem>
                  )}
                  {menuButtons.includes("protocol") && (
                    <DropdownMenuItem className="flex items-center gap-3 cursor-pointer" hasSubmenu>
                      <ProtocolIcon className="w-4 h-4" />
                      <span>Protocol</span>
                      <DropdownMenuSub>
                        <DropdownMenuSubContent className="w-48 rounded-xl">
                          {PROTOCOL_OPTIONS.map((opt) => {
                            const Icon = opt.Icon;
                            return (
                              <DropdownMenuItem
                                key={opt.value}
                                onClick={() => setConfig({ protocol: opt.value })}
                                className="flex items-center gap-3 cursor-pointer"
                              >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{opt.label}</span>
                                {config.protocol === opt.value && <span className="ml-auto text-primary">✓</span>}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuItem>
                  )}
                  {menuButtons.includes("auto") && (
                    <DropdownMenuItem
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => setConfig({ autoAnimate: !(config.autoAnimate ?? false) })}
                    >
                      <Timer className="w-4 h-4" />
                      <span>Auto</span>
                      {(config.autoAnimate ?? false) && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                  )}
                  {menuButtons.includes("repeat") && (
                    <DropdownMenuItem
                      className={cn(
                        "flex items-center gap-3 cursor-pointer",
                        !(config.autoAnimate ?? false) && "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                      onClick={() => setConfig({ autoRepeat: !(config.autoRepeat ?? false) })}
                    >
                      <Repeat className="w-4 h-4" />
                      <span>Repeat</span>
                      {(config.autoRepeat ?? false) && <span className="ml-auto text-primary">✓</span>}
                    </DropdownMenuItem>
                  )}
                  {menuButtons.includes("speed") && (
                    <DropdownMenuItem className="flex items-center gap-3 cursor-pointer" hasSubmenu>
                      <SpeedIcon className="w-4 h-4" />
                      <span>Speed</span>
                      <DropdownMenuSub>
                        <DropdownMenuSubContent className="w-48 rounded-xl">
                          {SPEED_OPTIONS.map((opt) => {
                            const Icon = opt.Icon;
                            return (
                              <DropdownMenuItem
                                key={opt.value}
                                onClick={() => setConfig({ speed: opt.value })}
                                className="flex items-center gap-3 cursor-pointer"
                              >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{opt.label}</span>
                                {config.speed === opt.value && <span className="ml-auto text-primary">✓</span>}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuItem>
                  )}
                  {menuButtons.includes("reset") && (
                    <DropdownMenuItem className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </DropdownMenuItem>
                  )}
                  {menuButtons.includes("theme") && (
                    <DropdownMenuItem className="flex items-center gap-3 cursor-pointer" hasSubmenu>
                      <Palette className="w-4 h-4" />
                      <span>Theme</span>
                      <DropdownMenuSub>
                        <DropdownMenuSubContent className="w-48 rounded-xl">
                          {themes.map((t) => (
                            <DropdownMenuItem
                              key={t.name}
                              onClick={() => setTheme(t.name)}
                              className="flex items-center gap-3 cursor-pointer"
                            >
                              <div className={cn("w-6 h-6 rounded", t.colors)} />
                              <span>{t.label}</span>
                              {theme === t.name && <span className="ml-auto text-primary">✓</span>}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                    </DropdownMenuItem>
                  )}
                  <div className="h-px bg-border my-1" />
                </>
              )}
              <AnimatePresence>
                <motion.div
                  key="story"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setStoryModalOpen(true)}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>How it works</span>
                  </DropdownMenuItem>
                </motion.div>
                <motion.div
                  key="legacy"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0.02 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate("/legacy")}
                  >
                    <History className="w-4 h-4" />
                    <span>Legacy version</span>
                  </DropdownMenuItem>
                </motion.div>
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0.03 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setAboutModalOpen(true)}
                  >
                    <Info className="w-4 h-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                </motion.div>
                <motion.div
                  key="github"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0.06 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => openLink("https://github.com/Roboticela/osi-model-simulator", { openInNewTab: true })}
                  >
                    <Github className="w-4 h-4" />
                    <span>Github</span>
                  </DropdownMenuItem>
                </motion.div>
                <motion.div
                  key="license"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0.09 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setLicenseModalOpen(true)}
                  >
                    <FileText className="w-4 h-4" />
                    <span>License</span>
                  </DropdownMenuItem>
                </motion.div>
                <motion.div
                  key="support"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0.12 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      openLink("https://roboticela.com/support", { openInNewTab: true });
                    }}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                </motion.div>
                <motion.div
                  key="divider-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                >
                  <div className="h-px bg-border my-1" />
                </motion.div>
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0.18 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      openLink("https://roboticela.com/privacy", { openInNewTab: true });
                    }}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </DropdownMenuItem>
                </motion.div>
                <motion.div
                  key="terms"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: 0.21 }}
                >
                  <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => {
                      openLink("https://roboticela.com/terms", { openInNewTab: true });
                    }}
                  >
                    <Scale className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </DropdownMenuItem>
                </motion.div>
              </AnimatePresence>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </motion.div>
      </motion.header>

      <StoryModal isOpen={storyModalOpen} onClose={() => setStoryModalOpen(false)} />
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <LicenseModal isOpen={licenseModalOpen} onClose={() => setLicenseModalOpen(false)} />
    </>
  );
}
