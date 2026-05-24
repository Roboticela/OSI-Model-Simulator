import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function QuizNavBar() {
  return (
    <div className="flex-shrink-0 border-b border-border bg-card/50">
      <div className="flex items-center h-10 px-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Simulator
        </Link>
      </div>
    </div>
  );
}
