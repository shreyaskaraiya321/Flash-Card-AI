export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-5 py-16 fade-in" id="loading-spinner">
      <div className="spinner" />
      <div className="text-center">
        <p className="text-text-primary text-sm font-light mb-2">Generating flashcards with AI...</p>
        <div className="w-48 h-1 bg-surface2 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-1/3 bg-accent rounded-full pulse-bar" />
        </div>
      </div>
    </div>
  );
}
