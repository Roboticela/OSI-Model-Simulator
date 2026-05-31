import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2 } from "lucide-react";
import { Button } from "./ui/button";
import { DISMISSAL_KEYS, isDismissed, setDismissed } from "../lib/dismissals";

const SHOW_DELAY_MS = 30_000;

export default function GamesPromoPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isDismissed(DISMISSAL_KEYS.gamesPromo)) return;

    const timer = window.setTimeout(() => {
      if (!isDismissed(DISMISSAL_KEYS.gamesPromo)) {
        setVisible(true);
      }
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setDismissed(DISMISSAL_KEYS.gamesPromo);
    setVisible(false);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Try networking games"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed z-[100] w-[min(calc(100vw-2rem),20rem)] rounded-xl border border-border bg-card shadow-lg p-4"
          style={{
            bottom: "max(1rem, env(safe-area-inset-bottom))",
            right: "max(1rem, env(safe-area-inset-right))",
            left: "auto",
            top: "auto",
          }}
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 pr-6">
            <div className="w-10 h-10 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground mb-1">Try Games</p>
              <p className="text-sm text-tertiary leading-snug mb-3">
                Test your networking knowledge with quizzes, port matching, and more.
              </p>
              <Link to="/quiz" onClick={dismiss}>
                <Button size="sm" className="rounded-lg w-full">
                  Open Games
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
