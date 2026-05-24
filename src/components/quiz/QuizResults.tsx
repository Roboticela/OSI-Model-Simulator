import { motion } from 'framer-motion';
import { Trophy, RefreshCcw, ArrowLeft, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface QuizResultsProps {
  gameName: string;
  score: number;
  maxStreak: number;
  correctCount: number;
  totalChallenges: number;
  onPlayAgain: () => void;
  onBackToHub: () => void;
}

export default function QuizResults({
  gameName,
  score,
  maxStreak,
  correctCount,
  totalChallenges,
  onPlayAgain,
  onBackToHub,
}: QuizResultsProps) {
  const accuracy = totalChallenges > 0 ? Math.round((correctCount / totalChallenges) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-8 bg-card/50 border border-border rounded-xl"
    >
      <div className="w-16 h-16 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-center mb-6">
        <Trophy className="w-8 h-8 text-primary" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-1">{gameName} Complete!</h2>
      <p className="text-tertiary mb-8 text-center">
        You got {correctCount} of {totalChallenges} correct ({accuracy}%)
      </p>

      <div className="grid grid-cols-3 gap-3 w-full mb-10">
        <div className="bg-accent/10 p-4 rounded-xl border border-border flex flex-col items-center">
          <span className="text-xs text-tertiary mb-1 uppercase tracking-wider font-semibold">Score</span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">{score}</span>
        </div>
        <div className="bg-accent/10 p-4 rounded-xl border border-border flex flex-col items-center">
          <span className="text-xs text-tertiary mb-1 uppercase tracking-wider font-semibold">Streak</span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">{maxStreak}</span>
        </div>
        <div className="bg-accent/10 p-4 rounded-xl border border-border flex flex-col items-center">
          <span className="text-xs text-tertiary mb-1 uppercase tracking-wider font-semibold">Accuracy</span>
          <span className="text-2xl sm:text-3xl font-bold text-primary">{accuracy}%</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
          <Button size="lg" className="w-full rounded-xl gap-2 h-12" onClick={onPlayAgain}>
            <RefreshCcw className="w-5 h-5" />
            Play Again
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
          <Button variant="outline" size="lg" className="w-full rounded-xl gap-2 h-12" onClick={onBackToHub}>
            <LayoutGrid className="w-5 h-5" />
            All Games
          </Button>
        </motion.div>
        <Link to="/" className="flex-1">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" size="lg" className="w-full rounded-xl gap-2 h-12">
              <ArrowLeft className="w-5 h-5" />
              Simulator
            </Button>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}
