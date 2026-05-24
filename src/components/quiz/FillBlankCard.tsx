import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FillBlankChallenge } from '../../data/quizTypes';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';

interface FillBlankCardProps {
  challenge: FillBlankChallenge;
  onAnswer: (index: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function FillBlankCard({ challenge, onAnswer, onNext, isLast }: FillBlankCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [challenge.id]);

  const parts = challenge.sentence.split('___');
  const isCorrect = selected === challenge.correctOptionIndex;
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
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Fill the Blank" />

        <div className="text-lg sm:text-xl font-medium text-foreground mb-6 leading-relaxed">
          {parts[0]}
          <span className={clsx(
            'inline-flex items-center px-3 py-1 mx-1 rounded-lg border min-w-[4rem] justify-center font-semibold',
            !answered && 'border-dashed border-primary/40 bg-primary/5 text-primary',
            answered && isCorrect && 'border-primary bg-primary/10 text-primary',
            answered && !isCorrect && 'border-border bg-accent/20 text-foreground line-through opacity-70'
          )}>
            {answered ? challenge.options[selected] : '???'}
          </span>
          {parts[1] ?? ''}
        </div>

        {!answered ? (
          <>
            <p className="text-sm text-tertiary mb-3">Choose the missing word:</p>
            <div className="grid grid-cols-2 gap-3">
              {challenge.options.map((option, idx) => (
                <motion.button
                  key={option}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(idx)}
                  className="p-4 min-h-[52px] rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 font-medium text-foreground transition-colors text-center"
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!isCorrect && (
                <p className="text-sm text-foreground mb-4 p-3 rounded-lg border border-border bg-accent/10">
                  Correct word: <span className="font-semibold text-primary">{challenge.options[challenge.correctOptionIndex]}</span>
                </p>
              )}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {challenge.options.map((option, idx) => {
                  const isSelected = selected === idx;
                  const isCorrectOption = idx === challenge.correctOptionIndex;
                  return (
                    <div
                      key={option}
                      className={twMerge(
                        'p-4 min-h-[52px] rounded-lg border font-medium text-center',
                        isCorrectOption && 'border-primary bg-primary/10 text-primary',
                        isSelected && !isCorrectOption && 'border-border bg-accent/20',
                        !isSelected && !isCorrectOption && 'border-border/40 opacity-40'
                      )}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
              <ChallengeFeedback
                isCorrect={isCorrect}
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
