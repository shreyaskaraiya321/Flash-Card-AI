export default function FlashcardGrid({ cards }) {
  if (!cards.length) return null;

  return (
    <div className="w-full fade-in" id="flashcard-grid">
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-surface border border-border-subtle rounded-card p-5 flex flex-col gap-3
              hover:border-border-hover transition-colors"
          >
            <span className="text-xs text-accent font-medium">Card {i + 1}</span>
            <p className="text-text-primary text-sm font-light leading-relaxed">{card.q}</p>
            <div className="w-full h-px bg-border-subtle" />
            <p className="text-text-muted text-sm font-light leading-relaxed">{card.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
