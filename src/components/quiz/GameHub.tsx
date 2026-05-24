import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { GameMode, Category } from '../../data/quizTypes';
import { GAME_MODES, CATEGORIES } from '../../data/quizTypes';
import { getChallengesForMode } from '../../data/quizChallenges';
import { Button } from '../ui/button';
import { Play, Trophy, Info } from 'lucide-react';

interface GameHubProps {
  onStart: (mode: GameMode, category: Category | 'all') => void;
  highScore: number;
  maxStreak: number;
}

export default function GameHub({ onStart, highScore, maxStreak }: GameHubProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const modeConfig = GAME_MODES.find((m) => m.id === selectedMode)!;
  const availableCount = getChallengesForMode(
    selectedMode,
    selectedCategory === 'all' ? undefined : selectedCategory
  ).length;
  const rounds = Math.min(modeConfig.rounds, availableCount);

  // Auto-fallback to "All Topics" when category has no content for selected game
  useEffect(() => {
    if (selectedCategory === 'all') return;
    const count = getChallengesForMode(selectedMode, selectedCategory).length;
    if (count === 0) setSelectedCategory('all');
  }, [selectedMode, selectedCategory]);

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto p-4 sm:p-6 bg-card/50 rounded-xl border border-border"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
    >
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Networking Games
        </h1>
        <p className="text-tertiary max-w-xl mx-auto text-sm">
          Pick a game, pick a topic, then tap Start. Correct answers build your streak for bonus points.
        </p>
      </div>

      {(highScore > 0 || maxStreak > 0) && (
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-accent/10">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm text-tertiary">Best:</span>
            <span className="text-sm font-semibold text-primary">{highScore} pts</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-accent/10">
            <span className="text-sm text-tertiary">Streak:</span>
            <span className="text-sm font-semibold text-primary">{maxStreak}</span>
          </div>
        </div>
      )}

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">1. Choose a game</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {GAME_MODES.map((mode, i) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.id;
            const totalAvailable = getChallengesForMode(mode.id).length;
            return (
              <motion.button
                key={mode.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedMode(mode.id)}
                className={cn(
                  'text-left p-4 rounded-xl border transition-colors min-h-[88px]',
                  isSelected
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/20'
                    : 'border-border bg-card hover:bg-accent hover:border-primary/20'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0',
                    isSelected ? 'border-primary/30 bg-primary/10' : 'border-border bg-accent/10'
                  )}>
                    <Icon className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-foreground')} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground">{mode.name}</div>
                    <div className="text-sm text-tertiary mt-0.5">{mode.description}</div>
                    <div className="text-xs text-tertiary mt-1.5">{totalAvailable} questions</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* How to play for selected game */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5 mb-6">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-0.5">How to play {modeConfig.name}</p>
          <p className="text-sm text-tertiary">{modeConfig.howToPlay}</p>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-semibold text-foreground mb-3">2. Choose a topic</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = getChallengesForMode(
              selectedMode,
              cat.id === 'all' ? undefined : cat.id
            ).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                disabled={count === 0}
                className={cn(
                  'inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors min-h-[44px]',
                  count === 0 && 'opacity-40 cursor-not-allowed',
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.name}
                <span className="text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
        <p className="text-sm text-tertiary text-center sm:text-left">
          {rounds > 0
            ? `${rounds} question${rounds === 1 ? '' : 's'} · 100 pts × streak bonus`
            : 'No questions for this combination — try All Topics'}
        </p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            size="lg"
            className="rounded-xl gap-2 h-12 px-8 w-full sm:w-auto"
            disabled={rounds === 0}
            onClick={() => onStart(selectedMode, selectedCategory)}
          >
            <Play className="w-5 h-5" />
            Start game
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
