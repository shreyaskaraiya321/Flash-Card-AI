const CARD_COUNTS = [5, 10, 15, 20];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const CARD_STYLES = ['Q&A', 'Term→Definition', 'Fill-in-the-blank'];

function PillGroup({ label, options, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm text-text-muted mb-2 font-light">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const display = typeof opt === 'number' ? opt.toString() : opt;
          const isActive = value === opt;
          return (
            <button
              key={display}
              onClick={() => onChange(opt)}
              disabled={disabled}
              className={`px-4 py-2 text-sm rounded-full border transition-colors
                ${isActive
                  ? 'bg-accent/15 border-accent text-accent-light'
                  : 'bg-transparent border-border-subtle text-text-muted hover:border-border-hover hover:text-text-primary'}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {display}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function GenerationOptions({
  numCards, setNumCards,
  difficulty, setDifficulty,
  cardStyle, setCardStyle,
  onGenerate,
  disabled,
  hasInput,
}) {
  return (
    <div className="space-y-5 fade-in" id="generation-options">
      <PillGroup
        label="Number of cards"
        options={CARD_COUNTS}
        value={numCards}
        onChange={setNumCards}
        disabled={disabled}
      />
      <PillGroup
        label="Difficulty"
        options={DIFFICULTIES}
        value={difficulty}
        onChange={setDifficulty}
        disabled={disabled}
      />
      <PillGroup
        label="Card style"
        options={CARD_STYLES}
        value={cardStyle}
        onChange={setCardStyle}
        disabled={disabled}
      />
      <button
        id="generate-btn"
        onClick={onGenerate}
        disabled={disabled || !hasInput}
        className="w-full py-3.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium
          rounded-card transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-2"
      >
        Generate flashcards
      </button>
      {!hasInput && !disabled && (
        <p className="text-text-muted/60 text-xs text-center">
          Enter text, upload a PDF, or type a topic to get started.
        </p>
      )}
    </div>
  );
}
