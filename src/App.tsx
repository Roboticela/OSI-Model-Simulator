import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AppHeader from "./components/AppHeader";
import OSIInputForm from "./components/OSIInputForm";
import OSIVisualization from "./components/OSIVisualization";

const LEGACY_BANNER_STORAGE_KEY = "osi-legacy-banner-dismissed";

function App() {
  const leftContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = leftContainerRef.current;
    if (!el) return;
    const scrollToBottom = () => {
      el.scrollTop = el.scrollHeight - el.clientHeight;
    };
    scrollToBottom();
    const t = requestAnimationFrame(scrollToBottom);
    const t2 = setTimeout(scrollToBottom, 100);
    return () => {
      cancelAnimationFrame(t);
      clearTimeout(t2);
    };
  }, []);

  const [bannerVisible, setBannerVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(LEGACY_BANNER_STORAGE_KEY) !== "true";
  });

  const closeBanner = useCallback(() => {
    localStorage.setItem(LEGACY_BANNER_STORAGE_KEY, "true");
    setBannerVisible(false);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden overflow-y-auto custom-scrollbar bg-background">
      <AnimatePresence mode="wait">
        {bannerVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden flex-shrink-0 border-b border-primary/20 bg-primary/10"
          >
            <div className="flex items-center justify-center gap-2 w-full h-10 px-4 pr-12 relative">
              <Link
                to="/legacy"
                className="text-sm text-foreground/90 hover:text-foreground transition-colors text-center"
              >
                If you want to try the legacy version{" "}
                <span className="underline font-medium">click here</span>
              </Link>
              <button
                type="button"
                onClick={closeBanner}
                aria-label="Dismiss banner"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-primary/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AppHeader />
      <motion.div
        className="flex flex-col md:flex-row gap-2 sm:gap-4 p-2 sm:p-4 overflow-x-hidden overflow-y-auto md:overflow-y-hidden md:h-[calc(100vh-var(--content-offset))] md:max-h-[calc(100vh-var(--content-offset))]"
        style={
          {
            "--content-offset": bannerVisible ? "6rem" : "3.5rem",
          } as React.CSSProperties
        }
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Left — Input form (same height as right) */}
        <motion.div
          className="w-full md:flex-[0.28] flex flex-col min-w-0 md:min-w-[280px] md:max-w-[360px] md:h-full md:min-h-0 md:pr-2 flex-shrink-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div ref={leftContainerRef} className="w-full flex-1 min-h-0 flex flex-col rounded-xl border border-border bg-card/50 p-4 md:overflow-y-auto custom-scrollbar">
            <h2 className="text-lg font-semibold text-foreground mb-3">Simulation settings</h2>
            <OSIInputForm />
          </div>
        </motion.div>
        {/* Right — OSI visualization (on mobile: no fixed height, expands with content) */}
        <motion.div
          className="w-full md:flex-1 min-w-0 md:min-w-[400px] min-h-[280px] md:min-h-0 md:h-full md:max-h-full overflow-y-auto md:overflow-hidden flex flex-col flex-1 md:flex-initial"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OSIVisualization />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
