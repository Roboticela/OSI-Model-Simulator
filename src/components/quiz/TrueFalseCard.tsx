import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrueFalseChallenge } from '../../data/quizTypes';
import { Check, X } from 'lucide-react';
import { clsx } from 'clsx';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';

interface TrueFalseCardProps {
  challenge: TrueFalseChallenge;
  onAnswer: (answer: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function TrueFalseCard({ challenge, onAnswer, onNext, isLast }: TrueFalseCardProps) {
  const [selected, setSelected] = useState<boolean | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [challenge.id]);

  const handleSelect = (answer: boolean) => {
    if (selected !== null) return;
    setSelected(answer);
    onAnswer(answer);
  };

  const isCorrect = selected === challenge.isTrue;
  const answered = selected !== null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="True or False" />

        <p className="text-lg sm:text-xl font-semibold text-foreground mb-8 leading-snug">
          {challenge.statement}
        </p>

        {!answered ? (
          <>
            <p className="text-sm text-tertiary mb-3">Is this statement true or false?</p>
            <div className="grid grid-cols-2 gap-3">
              {([true, false] as const).map((value) => {
                const label = value ? 'True' : 'False';
                const Icon = value ? Check : X;
                return (
                  <motion.button
                    key={label}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(value)}
                    className="flex flex-col items-center justify-center gap-2 p-6 min-h-[100px] rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/30 transition-colors"
                  >
                    <Icon className="w-8 h-8 text-primary" />
                    <span className="font-semibold text-lg text-foreground">{label}</span>
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {([true, false] as const).map((value) => {
                  const label = value ? 'True' : 'False';
                  const isSelected = selected === value;
                  const isCorrectOption = value === challenge.isTrue;
                  const Icon = value ? Check : X;
                  return (
                    <div
                      key={label}
                      className={clsx(
                        'flex flex-col items-center justify-center gap-2 p-6 rounded-xl border min-h-[100px]',
                        isCorrectOption && 'border-primary bg-primary/10',
                        isSelected && !isCorrectOption && 'border-border bg-accent/20',
                        !isSelected && !isCorrectOption && 'border-border/40 opacity-40'
                      )}
                    >
                      <Icon className={clsx('w-8 h-8', isCorrectOption ? 'text-primary' : 'text-tertiary')} />
                      <span className={clsx('font-semibold text-lg', isCorrectOption && 'text-primary')}>
                        {label}
                      </span>
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
