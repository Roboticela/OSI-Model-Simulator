import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2 } from "lucide-react";
import { Button } from "./ui/button";
import { DISMISSAL_KEYS, isDismissed, setDismissed } from "../lib/dismissals";

const SHOW_DELAY_MS = 30_000;

export default function GamesPromoPopup() {
  const [visible, setVisible] = useState(false);

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,320px)] rounded-xl border border-border bg-card shadow-lg p-4"
          role="dialog"
          aria-label="Try networking games"
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
            <div>
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
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
