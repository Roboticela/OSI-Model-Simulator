import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PortPickerChallenge } from '../../data/quizTypes';
import { twMerge } from 'tailwind-merge';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';

interface PortPickerCardProps {
  challenge: PortPickerChallenge;
  onAnswer: (index: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function PortPickerCard({ challenge, onAnswer, onNext, isLast }: PortPickerCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [challenge.id]);

  const isCorrect = selected === challenge.correctOptionIndex;
  const answered = selected !== null;

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswer(index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Port Picker" />

        <p className="text-sm text-tertiary mb-2">Which port does this protocol use?</p>
        <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 mb-6 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-primary font-mono">{challenge.protocol}</p>
          {challenge.context && (
            <p className="text-sm text-tertiary mt-2">{challenge.context}</p>
          )}
        </div>

        {!answered ? (
          <>
            <p className="text-sm text-tertiary mb-3">Tap the correct port:</p>
            <div className="grid grid-cols-2 gap-3">
              {challenge.options.map((port, idx) => (
                <motion.button
                  key={port}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(idx)}
                  className="p-5 min-h-[64px] rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 font-mono text-xl font-bold text-foreground transition-colors"
                >
                  {port}
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {challenge.options.map((port, idx) => {
                  const isSelected = selected === idx;
                  const isCorrectOption = idx === challenge.correctOptionIndex;
                  return (
                    <div
                      key={port}
                      className={twMerge(
                        'p-5 min-h-[64px] rounded-xl border font-mono text-xl font-bold flex items-center justify-center',
                        isCorrectOption && 'border-primary bg-primary/10 text-primary',
                        isSelected && !isCorrectOption && 'border-border bg-accent/20 text-foreground',
                        !isSelected && !isCorrectOption && 'border-border/40 opacity-40 text-foreground'
                      )}
                    >
                      {port}
                    </div>
                  );
                })}
              </div>
              <ChallengeFeedback
                isCorrect={isCorrect}
                title={`Port ${challenge.options[challenge.correctOptionIndex]} is correct!`}
                wrongTitle={`Port ${challenge.options[challenge.correctOptionIndex]} was the answer`}
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
