import { useState, useCallback, useEffect } from 'react';
import { generateFlashcards } from '../services/api';

export function useFlashcards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [scores, setScores] = useState({});       // { index: 'correct' | 'wrong' }
  const [view, setView] = useState('study');       // 'study' | 'grid'
  const [phase, setPhase] = useState('idle');      // 'idle' | 'generating' | 'studying' | 'complete'

  const generate = useCallback(async ({ text, numCards, difficulty, cardStyle }) => {
    setError(null);
    setLoading(true);
    setPhase('generating');

    try {
      const result = await generateFlashcards({ text, numCards, difficulty, cardStyle });
      setCards(result);
      setCurrentIndex(0);
      setFlipped(false);
      setScores({});
      setView('study');
      setPhase('studying');
    } catch (err) {
      setError(err.message);
      setPhase('idle');
    } finally {
      setLoading(false);
    }
  }, []);

  const flip = useCallback(() => setFlipped((f) => !f), []);

  const next = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  }, [currentIndex, cards.length]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setFlipped(false);
    }
  }, [currentIndex]);

  const markCorrect = useCallback(() => {
    setScores((s) => ({ ...s, [currentIndex]: 'correct' }));
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setPhase('complete');
    }
  }, [currentIndex, cards.length]);

  const markWrong = useCallback(() => {
    setScores((s) => ({ ...s, [currentIndex]: 'wrong' }));
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setPhase('complete');
    }
  }, [currentIndex, cards.length]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setFlipped(false);
    setScores({});
    setPhase('studying');
    setView('study');
  }, []);

  const reset = useCallback(() => {
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);
    setScores({});
    setPhase('idle');
    setError(null);
    setView('study');
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Keyboard shortcuts
  useEffect(() => {
    if (phase !== 'studying' || view !== 'study') return;

    const handler = (e) => {
      // Ignore if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          flip();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prev();
          break;
        case 'KeyG':
          e.preventDefault();
          markCorrect();
          break;
        case 'KeyB':
          e.preventDefault();
          markWrong();
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, view, flip, next, prev, markCorrect, markWrong]);

  const correctCount = Object.values(scores).filter((s) => s === 'correct').length;
  const wrongCount = Object.values(scores).filter((s) => s === 'wrong').length;

  return {
    cards,
    loading,
    error,
    currentIndex,
    flipped,
    scores,
    view,
    phase,
    correctCount,
    wrongCount,
    generate,
    flip,
    next,
    prev,
    markCorrect,
    markWrong,
    restart,
    reset,
    clearError,
    setView,
  };
}
