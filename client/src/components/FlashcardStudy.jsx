export default function FlashcardStudy({
  cards,
  currentIndex,
  flipped,
  scores,
  onFlip,
  onNext,
  onPrev,
  onMarkCorrect,
  onMarkWrong,
}) {
  const card = cards[currentIndex];
  if (!card) return null;

  const progress = ((currentIndex + 1) / cards.length) * 100;
  const scored = scores[currentIndex];

  return (
    <div className="w-full max-w-2xl mx-auto fade-in" id="flashcard-study">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-text-muted font-light">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-xs text-text-muted font-light">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-1 bg-surface2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flip card */}
      <div className="flip-card w-full" style={{ height: '320px' }} onClick={onFlip}>
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-card-front text-center">
            <span className="absolute top-4 left-5 text-xs text-text-muted/50 font-light">Question</span>
            <p className="text-text-primary text-lg font-light leading-relaxed max-w-md">
              {card.q}
            </p>
            <p className="absolute bottom-5 text-text-muted/40 text-xs font-light">
              Click to reveal · Space
            </p>
          </div>

          {/* Back */}
          <div className="flip-card-back text-center">
            <span className="absolute top-4 left-5 text-xs text-accent font-medium">Answer</span>
            <p className="text-text-primary text-lg font-light leading-relaxed max-w-md">
              {card.a}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <button
          id="btn-prev"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 text-sm text-text-muted border border-border-subtle rounded-card
            hover:border-border-hover hover:text-text-primary transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <div className="flex gap-2">
          <button
            id="btn-wrong"
            onClick={onMarkWrong}
            className={`px-5 py-2.5 text-sm rounded-card border transition-colors
              ${scored === 'wrong'
                ? 'bg-error/15 border-error text-error'
                : 'border-border-subtle text-text-muted hover:border-error/50 hover:text-error'}`}
          >
            Still learning · B
          </button>
          <button
            id="btn-correct"
            onClick={onMarkCorrect}
            className={`px-5 py-2.5 text-sm rounded-card border transition-colors
              ${scored === 'correct'
                ? 'bg-success/15 border-success text-success'
                : 'border-border-subtle text-text-muted hover:border-success/50 hover:text-success'}`}
          >
            Got it · G
          </button>
        </div>

        <button
          id="btn-next"
          onClick={onNext}
          disabled={currentIndex === cards.length - 1}
          className="px-4 py-2.5 text-sm text-text-muted border border-border-subtle rounded-card
            hover:border-border-hover hover:text-text-primary transition-colors
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-text-muted/30 text-xs mt-4 font-light">
        Space = flip · ← → = navigate · G = got it · B = still learning
      </p>
    </div>
  );
}
