import { useState } from 'react';
import { useFlashcards } from './hooks/useFlashcards';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import InputTabs from './components/InputTabs';
import GenerationOptions from './components/GenerationOptions';
import FlashcardStudy from './components/FlashcardStudy';
import FlashcardGrid from './components/FlashcardGrid';
import ScoreScreen from './components/ScoreScreen';
import ExportMenu from './components/ExportMenu';
import ErrorBanner from './components/ErrorBanner';
import LoadingSpinner from './components/LoadingSpinner';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [numCards, setNumCards] = useState(10);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [cardStyle, setCardStyle] = useState('Q&A');

  const {
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
  } = useFlashcards();

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    generate({ text: inputText, numCards, difficulty, cardStyle });
  };

  const handleReset = () => {
    reset();
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-bg font-body">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pb-20">
        {/* Hero — only on idle */}
        {phase === 'idle' && <Hero />}

        {/* Error banner */}
        {error && (
          <div className={phase === 'idle' ? 'mt-4' : 'mt-20'}>
            <ErrorBanner message={error} onDismiss={clearError} />
          </div>
        )}

        {/* Input & Options — only when idle or generating */}
        {(phase === 'idle' || phase === 'generating') && (
          <div className="mt-8 space-y-8">
            <InputTabs
              inputText={inputText}
              onTextChange={setInputText}
              disabled={loading}
            />
            <GenerationOptions
              numCards={numCards}
              setNumCards={setNumCards}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              cardStyle={cardStyle}
              setCardStyle={setCardStyle}
              onGenerate={handleGenerate}
              disabled={loading}
              hasInput={inputText.trim().length > 0}
            />
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Study / Grid phase */}
        {phase === 'studying' && (
          <div className="mt-20">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {/* View toggle */}
                <div className="flex border border-border-subtle rounded-full overflow-hidden">
                  <button
                    id="view-study"
                    onClick={() => setView('study')}
                    className={`px-4 py-1.5 text-xs transition-colors
                      ${view === 'study'
                        ? 'bg-surface2 text-text-primary'
                        : 'text-text-muted hover:text-text-primary'}`}
                  >
                    Study
                  </button>
                  <button
                    id="view-grid"
                    onClick={() => setView('grid')}
                    className={`px-4 py-1.5 text-xs transition-colors
                      ${view === 'grid'
                        ? 'bg-surface2 text-text-primary'
                        : 'text-text-muted hover:text-text-primary'}`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ExportMenu cards={cards} />
                <button
                  id="btn-back"
                  onClick={handleReset}
                  className="px-4 py-1.5 text-xs text-text-muted border border-border-subtle rounded-full
                    hover:border-border-hover hover:text-text-primary transition-colors"
                >
                  New deck
                </button>
              </div>
            </div>

            {/* Content */}
            {view === 'study' ? (
              <FlashcardStudy
                cards={cards}
                currentIndex={currentIndex}
                flipped={flipped}
                scores={scores}
                onFlip={flip}
                onNext={next}
                onPrev={prev}
                onMarkCorrect={markCorrect}
                onMarkWrong={markWrong}
              />
            ) : (
              <FlashcardGrid cards={cards} />
            )}
          </div>
        )}

        {/* Score screen */}
        {phase === 'complete' && (
          <div className="mt-20">
            <div className="flex justify-end mb-4">
              <ExportMenu cards={cards} />
            </div>
            <ScoreScreen
              cards={cards}
              correctCount={correctCount}
              wrongCount={wrongCount}
              onRestart={restart}
              onReset={handleReset}
            />
          </div>
        )}
      </main>
    </div>
  );
}
