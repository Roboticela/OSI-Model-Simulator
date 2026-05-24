import { motion, AnimatePresence } from 'framer-motion';
import { useQuizEngine } from '../../hooks/useQuizEngine';
import GameHub from './GameHub';
import QuestionCard from './QuestionCard';
import TrueFalseCard from './TrueFalseCard';
import LayerOrderCard from './LayerOrderCard';
import MatchPairsCard from './MatchPairsCard';
import LayerPickCard from './LayerPickCard';
import FillBlankCard from './FillBlankCard';
import EncapsulationCard from './EncapsulationCard';
import PortPickerCard from './PortPickerCard';
import OddOneOutCard from './OddOneOutCard';
import QuizResults from './QuizResults';
import { Flame, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

export default function QuizBoard() {
  const {
    gameState,
    gameMode,
    category,
    modeConfig,
    startGame,
    goToHub,
    currentChallenge,
    currentIndex,
    totalChallenges,
    answerClassic,
    answerTrueFalse,
    answerLayerOrder,
    answerMatchPairs,
    answerLayerPick,
    answerFillBlank,
    answerEncapsulation,
    answerPortPicker,
    answerOddOneOut,
    nextChallenge,
    score,
    streak,
    maxStreak,
    correctCount,
    highScore,
    globalMaxStreak,
  } = useQuizEngine();

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">

      {/* Playing header */}
      <AnimatePresence>
        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-shrink-0 flex justify-between items-center px-4 py-3 md:px-8 border-b border-border bg-card/50 z-10 gap-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg flex-shrink-0 gap-1.5"
                onClick={goToHub}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Games</span>
              </Button>
              <div className="font-semibold text-foreground/80 truncate text-sm sm:text-base">
                {modeConfig?.name} ·{' '}
                <span className="text-primary">{currentIndex + 1}</span>/{totalChallenges}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-1.5 text-sm">
                <Flame className={`w-4 h-4 ${streak >= 2 ? 'text-primary' : 'text-tertiary'}`} />
                <span className="font-semibold text-foreground tabular-nums">{streak}</span>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                <span className="font-semibold text-primary text-sm">{score} pts</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {gameState === 'playing' && (
        <div className="w-full h-1 bg-secondary/50 absolute top-0 left-0 z-20">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / totalChallenges) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar w-full flex flex-col">
        <div className="m-auto w-full p-4">
          <AnimatePresence mode="wait">
            {gameState === 'hub' && (
              <GameHub
                key="hub"
                onStart={startGame}
                highScore={highScore}
                maxStreak={globalMaxStreak}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'classic' && (
              <QuestionCard
                key={`c-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerClassic}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'true-false' && (
              <TrueFalseCard
                key={`tf-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerTrueFalse}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'layer-order' && (
              <LayerOrderCard
                key={`lo-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerLayerOrder}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'match-pairs' && (
              <MatchPairsCard
                key={`mp-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerMatchPairs}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'layer-pick' && (
              <LayerPickCard
                key={`lp-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerLayerPick}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'fill-blank' && (
              <FillBlankCard
                key={`fb-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerFillBlank}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'encapsulation-order' && (
              <EncapsulationCard
                key={`eo-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerEncapsulation}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'port-picker' && (
              <PortPickerCard
                key={`pp-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerPortPicker}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'playing' && currentChallenge?.type === 'odd-one-out' && (
              <OddOneOutCard
                key={`oo-${currentIndex}`}
                challenge={currentChallenge}
                onAnswer={answerOddOneOut}
                onNext={nextChallenge}
                isLast={currentIndex === totalChallenges - 1}
              />
            )}

            {gameState === 'results' && modeConfig && (
              <QuizResults
                key="results"
                gameName={modeConfig.name}
                score={score}
                maxStreak={maxStreak}
                correctCount={correctCount}
                totalChallenges={totalChallenges}
                onPlayAgain={() => startGame(gameMode, category)}
                onBackToHub={goToHub}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
