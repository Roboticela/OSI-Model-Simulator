import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EncapsulationChallenge } from '../../data/quizTypes';
import { shuffleArray } from '../../data/quizTypes';
import { Button } from '../ui/button';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';
import ReorderList from './ReorderList';

interface EncapsulationCardProps {
  challenge: EncapsulationChallenge;
  onAnswer: (order: string[]) => boolean | undefined;
  onNext: () => void;
  isLast: boolean;
}

export default function EncapsulationCard({ challenge, onAnswer, onNext, isLast }: EncapsulationCardProps) {
  const [steps, setSteps] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setSteps(shuffleArray(challenge.steps));
    setSubmitted(false);
    setIsCorrect(false);
  }, [challenge.id, challenge.steps]);

  const handleSubmit = () => {
    if (submitted) return;
    const correct = onAnswer(steps) ?? false;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Encapsulation Rush" />

        <p className="text-base font-medium text-foreground mb-4">{challenge.prompt}</p>

        <ReorderList
          items={steps}
          onChange={setSteps}
          submitted={submitted}
          correctOrder={challenge.steps}
          hint="First step at top → last step at bottom"
        />

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="submit" className="flex justify-end mt-4">
              <Button className="rounded-lg min-h-11 px-6" onClick={handleSubmit}>
                Check order
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden mt-4"
            >
              <ChallengeFeedback
                isCorrect={isCorrect}
                title="Perfect path!"
                wrongTitle="Here's the correct order:"
                explanation={challenge.explanation}
                onNext={onNext}
                isLast={isLast}
              >
                {!isCorrect && (
                  <ol className="space-y-1.5 mb-4 text-sm list-decimal list-inside text-foreground">
                    {challenge.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
              </ChallengeFeedback>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
