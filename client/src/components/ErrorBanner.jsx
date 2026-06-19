export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className="w-full bg-error/10 border border-error/30 rounded-card px-5 py-4 flex items-start gap-3 fade-in"
      id="error-banner"
      role="alert"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round" />
        <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round" />
      </svg>
      <p className="text-error text-sm font-light flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-error/60 hover:text-error transition-colors flex-shrink-0"
        aria-label="Dismiss error"
        id="error-dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
          <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
