import { useState, useCallback, useEffect } from 'react';
import {
  type Challenge,
  type GameMode,
  type Category,
  GAME_MODES,
  shuffleArray,
} from '../data/quizTypes';
import { getChallengesForMode } from '../data/quizChallenges';
import { loadQuizStats, saveQuizStats } from '../lib/storage';

export type GameState = 'hub' | 'playing' | 'results';

export function useQuizEngine() {
  const [gameState, setGameState] = useState<GameState>('hub');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  const [globalHighScore, setGlobalHighScore] = useState(0);
  const [globalMaxStreak, setGlobalMaxStreak] = useState(0);

  useEffect(() => {
    loadQuizStats().then((stats) => {
      setGlobalHighScore(stats.highScore);
      setGlobalMaxStreak(stats.maxStreak);
    });
  }, []);

  const recordResult = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setStreak((prev) => {
        const next = prev + 1;
        setMaxStreak((m) => Math.max(m, next));
        setScore((s) => s + 100 * next);
        return next;
      });
      setCorrectCount((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  }, []);

  const startGame = useCallback((mode: GameMode, selectedCategory: Category | 'all') => {
    const modeConfig = GAME_MODES.find((m) => m.id === mode)!;
    const pool = getChallengesForMode(mode, selectedCategory === 'all' ? undefined : selectedCategory);

    if (pool.length === 0) return;

    const shuffled = shuffleArray(pool).slice(0, Math.min(modeConfig.rounds, pool.length));

    setGameMode(mode);
    setCategory(selectedCategory);
    setChallenges(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setGameState('playing');
  }, []);

  const answerClassic = useCallback((optionIndex: number) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'classic') return;
    recordResult(optionIndex === current.correctOptionIndex);
  }, [challenges, currentIndex, recordResult]);

  const answerTrueFalse = useCallback((answer: boolean) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'true-false') return;
    recordResult(answer === current.isTrue);
  }, [challenges, currentIndex, recordResult]);

  const answerLayerOrder = useCallback((order: string[]) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'layer-order') return;
    const isCorrect = order.every((layer, i) => layer === current.correctOrder[i]);
    recordResult(isCorrect);
    return isCorrect;
  }, [challenges, currentIndex, recordResult]);

  const answerMatchPairs = useCallback((matches: Record<string, string>) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'match-pairs') return;
    const isCorrect = current.pairs.every((pair) => matches[pair.left] === pair.right);
    recordResult(isCorrect);
    return isCorrect;
  }, [challenges, currentIndex, recordResult]);

  const answerLayerPick = useCallback((layer: string) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'layer-pick') return;
    recordResult(layer === current.correctLayer);
  }, [challenges, currentIndex, recordResult]);

  const answerFillBlank = useCallback((optionIndex: number) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'fill-blank') return;
    recordResult(optionIndex === current.correctOptionIndex);
  }, [challenges, currentIndex, recordResult]);

  const answerEncapsulation = useCallback((order: string[]) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'encapsulation-order') return;
    const isCorrect = order.every((step, i) => step === current.steps[i]);
    recordResult(isCorrect);
    return isCorrect;
  }, [challenges, currentIndex, recordResult]);

  const answerPortPicker = useCallback((optionIndex: number) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'port-picker') return;
    recordResult(optionIndex === current.correctOptionIndex);
  }, [challenges, currentIndex, recordResult]);

  const answerOddOneOut = useCallback((optionIndex: number) => {
    const current = challenges[currentIndex];
    if (current?.type !== 'odd-one-out') return;
    recordResult(optionIndex === current.oddIndex);
  }, [challenges, currentIndex, recordResult]);

  useEffect(() => {
    if (gameState !== 'results') return;
    setGlobalHighScore((prev) => {
      const next = Math.max(score, prev);
      setGlobalMaxStreak((prevStreak) => {
        const nextStreak = Math.max(maxStreak, prevStreak);
        if (next > prev || nextStreak > prevStreak) {
          saveQuizStats({ highScore: next, maxStreak: nextStreak }).catch(console.error);
        }
        return nextStreak;
      });
      return next;
    });
  }, [gameState, score, maxStreak]);

  const finishGame = useCallback(() => {
    setGameState('results');
  }, []);

  const nextChallenge = useCallback(() => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishGame();
    }
  }, [currentIndex, challenges.length, finishGame]);

  const goToHub = useCallback(() => {
    setGameState('hub');
  }, []);

  const currentChallenge = challenges[currentIndex];
  const modeConfig = GAME_MODES.find((m) => m.id === gameMode);

  return {
    gameState,
    gameMode,
    category,
    modeConfig,
    startGame,
    goToHub,
    currentChallenge,
    currentIndex,
    totalChallenges: challenges.length,
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
    highScore: globalHighScore,
    globalMaxStreak,
  };
}
