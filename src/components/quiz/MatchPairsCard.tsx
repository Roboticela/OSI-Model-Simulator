import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MatchPairsChallenge } from '../../data/quizTypes';
import { shuffleArray } from '../../data/quizTypes';
import { clsx } from 'clsx';
import { Button } from '../ui/button';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';

interface MatchPairsCardProps {
  challenge: MatchPairsChallenge;
  onAnswer: (matches: Record<string, string>) => boolean | undefined;
  onNext: () => void;
  isLast: boolean;
}

function getOptionsForPair(challenge: MatchPairsChallenge, pairIndex: number): string[] {
  const correct = challenge.pairs[pairIndex].right;
  const distractors = challenge.pairs
    .filter((_, i) => i !== pairIndex)
    .map((p) => p.right);
  return shuffleArray([correct, ...distractors.slice(0, 3)]);
}

export default function MatchPairsCard({ challenge, onAnswer, onNext, isLast }: MatchPairsCardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [stepFeedback, setStepFeedback] = useState<{ correct: boolean; picked: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentPair = challenge.pairs[stepIndex];
  const options = useMemo(
    () => (currentPair ? getOptionsForPair(challenge, stepIndex) : []),
    [challenge, stepIndex, currentPair]
  );

  useEffect(() => {
    setStepIndex(0);
    setMatches({});
    setStepFeedback(null);
    setFinished(false);
    setIsCorrect(false);
  }, [challenge.id]);

  const handlePick = (right: string) => {
    if (stepFeedback || finished || !currentPair) return;
    const correct = right === currentPair.right;
    setMatches((prev) => ({ ...prev, [currentPair.left]: right }));
    setStepFeedback({ correct, picked: right });
  };

  const handleContinue = () => {
    if (!stepFeedback || !currentPair) return;

    if (stepIndex < challenge.pairs.length - 1) {
      setStepIndex((i) => i + 1);
      setStepFeedback(null);
      return;
    }

    const allMatches = { ...matches, [currentPair.left]: stepFeedback.picked };
    const allCorrect = onAnswer(allMatches) ?? false;
    setIsCorrect(allCorrect);
    setFinished(true);
  };

  if (finished) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
        >
          <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Protocol Match" />
          <ChallengeFeedback
            isCorrect={isCorrect}
            title="All pairs matched!"
            wrongTitle="Some matches were incorrect."
            explanation={challenge.explanation}
            onNext={onNext}
            isLast={isLast}
          >
            {!isCorrect && (
              <div className="space-y-2 mb-4">
                {challenge.pairs.map((pair) => (
                  <div key={pair.left} className="flex flex-wrap items-center gap-2 text-sm p-2 rounded-lg bg-card border border-border">
                    <span className="font-medium text-foreground">{pair.left}</span>
                    <span className="text-tertiary">→</span>
                    <span className="text-primary font-medium">{pair.right}</span>
                  </div>
                ))}
              </div>
            )}
          </ChallengeFeedback>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        key={`${challenge.id}-${stepIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Protocol Match" />

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-tertiary">
            Match {stepIndex + 1} of {challenge.pairs.length}
          </p>
          <div className="flex gap-1">
            {challenge.pairs.map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'w-2 h-2 rounded-full',
                  i < stepIndex && 'bg-primary',
                  i === stepIndex && 'bg-primary ring-2 ring-primary/30',
                  i > stepIndex && 'bg-border'
                )}
              />
            ))}
          </div>
        </div>

        <p className="text-base text-tertiary mb-2">{challenge.prompt}</p>
        <p className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
          {currentPair?.left}
        </p>

        {!stepFeedback ? (
          <>
            <p className="text-sm text-tertiary mb-3">Tap the correct match:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handlePick(option)}
                  className="p-4 min-h-[52px] rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 text-left font-medium text-foreground transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                'p-4 rounded-xl border mb-4',
                stepFeedback.correct ? 'bg-primary/5 border-primary/30' : 'bg-accent/10 border-border'
              )}
            >
              <p className={clsx('font-semibold mb-1', stepFeedback.correct ? 'text-primary' : 'text-foreground')}>
                {stepFeedback.correct ? 'Correct!' : `Correct answer: ${currentPair?.right}`}
              </p>
              <p className="text-sm text-tertiary">
                {currentPair?.left} → {stepFeedback.correct ? stepFeedback.picked : currentPair?.right}
              </p>
            </motion.div>
            <div className="flex justify-end">
              <Button className="rounded-lg min-h-11 px-6" onClick={handleContinue}>
                {stepIndex < challenge.pairs.length - 1 ? 'Next match' : 'See results'}
              </Button>
            </div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
}
