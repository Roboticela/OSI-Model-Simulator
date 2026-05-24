import { Link } from "react-router-dom";
import { Gamepad2, Play } from "lucide-react";
import { Button } from "./ui/button";

export default function GamesQuickLink() {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-start gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5">
        <div className="w-9 h-9 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Gamepad2 className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground mb-0.5">Networking Games</p>
          <p className="text-xs text-tertiary leading-snug mb-2.5">
            Quizzes, port matching, layer ordering, and more.
          </p>
          <Link to="/quiz">
            <Button size="sm" className="rounded-lg gap-1.5 h-8 w-full">
              <Play className="w-3.5 h-3.5" />
              Play Games
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
