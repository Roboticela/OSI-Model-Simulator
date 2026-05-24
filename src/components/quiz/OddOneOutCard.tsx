import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OddOneOutChallenge } from '../../data/quizTypes';
import { twMerge } from 'tailwind-merge';
import { CircleOff } from 'lucide-react';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';

interface OddOneOutCardProps {
  challenge: OddOneOutChallenge;
  onAnswer: (index: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function OddOneOutCard({ challenge, onAnswer, onNext, isLast }: OddOneOutCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [challenge.id]);

  const isCorrect = selected === challenge.oddIndex;
  const answered = selected !== null;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswer(index);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Odd One Out" />

        <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-accent/5 mb-6">
          <CircleOff className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-lg font-medium text-foreground leading-snug">{challenge.prompt}</p>
        </div>

        {!answered ? (
          <>
            <p className="text-sm text-tertiary mb-3">Tap the one that does not belong:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challenge.options.map((option, idx) => (
                <motion.button
                  key={option}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(idx)}
                  className="p-4 min-h-[52px] rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 text-left font-medium text-foreground transition-colors"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {challenge.options.map((option, idx) => {
                  const isSelected = selected === idx;
                  const isOddOne = idx === challenge.oddIndex;
                  return (
                    <div
                      key={option}
                      className={twMerge(
                        'p-4 min-h-[52px] rounded-lg border font-medium flex items-center gap-2',
                        isOddOne && 'border-primary bg-primary/10 text-primary',
                        isSelected && !isOddOne && 'border-border bg-accent/20 text-foreground',
                        !isSelected && !isOddOne && 'border-border/40 opacity-50 text-foreground'
                      )}
                    >
                      {isOddOne && <CircleOff className="w-4 h-4 flex-shrink-0" />}
                      {option}
                    </div>
                  );
                })}
              </div>
              <ChallengeFeedback
                isCorrect={isCorrect}
                title={`Correct — "${challenge.options[challenge.oddIndex]}" doesn't belong!`}
                wrongTitle={`The odd one out was "${challenge.options[challenge.oddIndex]}"`}
                explanation={challenge.explanation}
                onNext={onNext}
                isLast={isLast}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
