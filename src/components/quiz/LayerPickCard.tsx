import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LayerPickChallenge } from '../../data/quizTypes';
import { OSI_LAYERS } from '../../data/quizTypes';
import { CheckCircle2, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import ChallengeMeta from './ChallengeMeta';
import ChallengeFeedback from './ChallengeFeedback';

interface LayerPickCardProps {
  challenge: LayerPickChallenge;
  onAnswer: (layer: string) => void;
  onNext: () => void;
  isLast: boolean;
}

export default function LayerPickCard({ challenge, onAnswer, onNext, isLast }: LayerPickCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [challenge.id]);

  const handlePick = (layer: string) => {
    if (selected !== null) return;
    setSelected(layer);
    onAnswer(layer);
  };

  const isCorrect = selected === challenge.correctLayer;
  const answered = selected !== null;

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        key={challenge.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-card/50 border border-border rounded-xl p-6 sm:p-8"
      >
        <ChallengeMeta category={challenge.category} difficulty={challenge.difficulty} modeLabel="Layer Spotlight" />

        <div className="p-4 rounded-lg border border-border bg-accent/5 mb-6">
          <p className="text-base font-medium text-foreground leading-snug">{challenge.clue}</p>
        </div>

        {!answered ? (
          <>
            <p className="text-sm text-tertiary mb-3">Which OSI layer is this?</p>
            <div className="space-y-1.5">
              {OSI_LAYERS.map((layer, index) => {
                const layerNum = 7 - index;
                return (
                  <motion.button
                    key={layer}
                    type="button"
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handlePick(layer)}
                    className="w-full flex items-center gap-3 p-3.5 min-h-[52px] rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 text-left transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg border border-border bg-accent/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      L{layerNum}
                    </span>
                    <span className="font-medium text-sm text-foreground">{layer}</span>
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="space-y-1.5 mb-6">
                {OSI_LAYERS.map((layer, index) => {
                  const layerNum = 7 - index;
                  const isSelected = selected === layer;
                  const isCorrectLayer = layer === challenge.correctLayer;
                  return (
                    <div
                      key={layer}
                      className={clsx(
                        'w-full flex items-center gap-3 p-3.5 rounded-lg border min-h-[52px]',
                        isCorrectLayer && 'border-primary bg-primary/10',
                        isSelected && !isCorrectLayer && 'border-border bg-accent/20',
                        !isSelected && !isCorrectLayer && 'border-border/40 opacity-40'
                      )}
                    >
                      <span className="w-8 h-8 rounded-lg border border-border bg-accent/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        L{layerNum}
                      </span>
                      <span className={clsx('flex-1 font-medium text-sm', isCorrectLayer && 'text-primary')}>
                        {layer}
                      </span>
                      {isCorrectLayer && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                      {isSelected && !isCorrectLayer && <XCircle className="w-4 h-4 text-tertiary flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
              <ChallengeFeedback
                isCorrect={isCorrect}
                title="Correct layer!"
                wrongTitle={`Answer: ${challenge.correctLayer}`}
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
