import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LayerOrderChallenge } from '../../data/quizTypes';
import { shuffleArray } from '../../data/quizTypes';
import { Button } from '../ui/button';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';
import ReorderList from './ReorderList';

interface LayerOrderCardProps {
  challenge: LayerOrderChallenge;
  onAnswer: (order: string[]) => boolean | undefined;
  onNext: () => void;
  isLast: boolean;
}

export default function LayerOrderCard({ challenge, onAnswer, onNext, isLast }: LayerOrderCardProps) {
  const [layers, setLayers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setLayers(shuffleArray(challenge.correctOrder));
    setSubmitted(false);
    setIsCorrect(false);
  }, [challenge.id, challenge.correctOrder]);

  const handleSubmit = () => {
    if (submitted) return;
    const correct = onAnswer(layers) ?? false;
    setIsCorrect(correct);
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Stack the Layers" />

        <p className="text-base font-medium text-foreground mb-4">{challenge.prompt}</p>

        <ReorderList
          items={layers}
          onChange={setLayers}
          submitted={submitted}
          correctOrder={challenge.correctOrder}
          hint="Top = Layer 7 (Application) · Bottom = Layer 1 (Physical)"
          renderBadge={(_item, index) => (
            <span className="w-8 h-8 rounded-lg border border-border bg-accent/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
              {7 - index}
            </span>
          )}
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
                title="Perfect stack!"
                wrongTitle="Here's the correct order:"
                explanation={challenge.explanation}
                onNext={onNext}
                isLast={isLast}
              >
                {!isCorrect && (
                  <ol className="space-y-1 mb-4 text-sm">
                    {challenge.correctOrder.map((layer, i) => (
                      <li key={layer} className="flex items-center gap-2 text-foreground">
                        <span className="w-6 h-6 rounded bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                          {7 - i}
                        </span>
                        {layer}
                      </li>
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
