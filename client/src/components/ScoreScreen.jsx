export default function ScoreScreen({ cards, correctCount, wrongCount, onRestart, onReset }) {
  const total = cards.length;
  const answered = correctCount + wrongCount;
  const percentage = answered > 0 ? Math.round((correctCount / answered) * 100) : 0;

  // Score ring math (SVG circle circumference = 2πr, r=45)
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const getMessage = () => {
    if (percentage === 100) return "Perfect score! You've mastered this material. 🎯";
    if (percentage >= 80) return "Excellent work! You're almost there. 🌟";
    if (percentage >= 60) return "Good effort! A few more reviews will help. 💪";
    if (percentage >= 40) return "You're making progress. Keep practicing! 📚";
    return "Don't worry — every expert was once a beginner. Try again! 🚀";
  };

  return (
    <div className="w-full max-w-md mx-auto text-center fade-in py-8" id="score-screen">
      {/* Score ring */}
      <div className="relative w-36 h-36 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke={percentage >= 60 ? '#4ADE80' : '#F87171'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="score-ring"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-display text-text-primary">{percentage}%</span>
        </div>
      </div>

      {/* Message */}
      <p className="text-text-primary text-lg font-light mb-2">{getMessage()}</p>

      {/* Stats */}
      <div className="flex justify-center gap-8 mt-6 mb-8">
        <div>
          <p className="text-2xl font-display text-success">{correctCount}</p>
          <p className="text-xs text-text-muted font-light mt-1">Got it</p>
        </div>
        <div className="w-px bg-border-subtle" />
        <div>
          <p className="text-2xl font-display text-error">{wrongCount}</p>
          <p className="text-xs text-text-muted font-light mt-1">Still learning</p>
        </div>
        <div className="w-px bg-border-subtle" />
        <div>
          <p className="text-2xl font-display text-text-primary">{total}</p>
          <p className="text-xs text-text-muted font-light mt-1">Total</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          id="btn-study-again"
          onClick={onRestart}
          className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium
            rounded-card transition-colors"
        >
          Study again
        </button>
        <button
          id="btn-new-cards"
          onClick={onReset}
          className="w-full py-3.5 bg-transparent border border-border-subtle text-text-muted text-sm
            rounded-card hover:border-border-hover hover:text-text-primary transition-colors"
        >
          Generate new cards
        </button>
      </div>
    </div>
  );
}
