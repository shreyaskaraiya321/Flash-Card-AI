import { useState } from 'react';

export default function ExportMenu({ cards }) {
  const [toast, setToast] = useState(null);

  if (!cards.length) return null;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const downloadJSON = () => {
    const data = cards.map((c) => ({ q: c.q, a: c.a }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('JSON downloaded');
  };

  const downloadCSV = () => {
    const escape = (s) => `"${s.replace(/"/g, '""')}"`;
    const rows = ['Question,Answer', ...cards.map((c) => `${escape(c.q)},${escape(c.a)}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flashcards.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV downloaded');
  };

  const copyAnki = () => {
    const text = cards.map((c) => `${c.q}\t${c.a}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard — paste into Anki import');
    }).catch(() => {
      showToast('Failed to copy');
    });
  };

  return (
    <div className="relative" id="export-menu">
      <div className="flex gap-2 flex-wrap">
        <button
          id="export-json"
          onClick={downloadJSON}
          className="px-4 py-2 text-xs text-text-muted border border-border-subtle rounded-full
            hover:border-border-hover hover:text-text-primary transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="7,10 12,15 17,10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
          </svg>
          JSON
        </button>
        <button
          id="export-csv"
          onClick={downloadCSV}
          className="px-4 py-2 text-xs text-text-muted border border-border-subtle rounded-full
            hover:border-border-hover hover:text-text-primary transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="7,10 12,15 17,10" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" />
          </svg>
          CSV
        </button>
        <button
          id="export-anki"
          onClick={copyAnki}
          className="px-4 py-2 text-xs text-text-muted border border-border-subtle rounded-full
            hover:border-border-hover hover:text-text-primary transition-colors flex items-center gap-1.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="9" y="9" width="13" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Anki
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast">
          <div className="bg-surface2 border border-border-subtle rounded-card px-5 py-3 text-sm text-text-primary shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
