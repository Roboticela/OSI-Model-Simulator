import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ClassicChallenge } from '../../data/quizTypes';
import { CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

interface QuestionCardProps {
  challenge: ClassicChallenge;
  onAnswer: (index: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function QuestionCard({ challenge, onAnswer, onNext, isLast }: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [challenge.id]);

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    onAnswer(index);
  };

  const isCorrect = selectedOption === challenge.correctOptionIndex;
  const answered = selectedOption !== null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Classic Quiz" />

        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-6 leading-snug">
          {challenge.text}
        </h2>

        {!answered ? (
          <>
            <p className="text-sm text-tertiary mb-3">Tap your answer:</p>
            <div className="flex flex-col gap-3">
              {challenge.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSelect(idx)}
                  className="relative text-left p-4 min-h-[52px] rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 transition-colors flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg border border-border bg-accent/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {OPTION_LABELS[idx]}
                  </span>
                  <span className="text-base font-medium text-foreground">{option}</span>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col gap-2 mb-6">
                {challenge.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === challenge.correctOptionIndex;
                  return (
                    <div
                      key={idx}
                      className={twMerge(
                        'flex items-center gap-3 p-4 min-h-[52px] rounded-lg border',
                        isCorrectOption && 'border-primary bg-primary/10',
                        isSelected && !isCorrectOption && 'border-border bg-accent/20',
                        !isSelected && !isCorrectOption && 'border-border/40 opacity-50'
                      )}
                    >
                      <span className="w-8 h-8 rounded-lg border border-border bg-accent/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                        {OPTION_LABELS[idx]}
                      </span>
                      <span className={clsx('flex-1 text-base font-medium', isCorrectOption && 'text-primary')}>
                        {option}
                      </span>
                      {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                      {isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-tertiary flex-shrink-0" />}
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
