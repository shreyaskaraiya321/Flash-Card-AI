import { useState, useRef } from 'react';
import { extractTextFromPDF } from '../services/pdfParser';

const TABS = [
  { id: 'paste', label: 'Paste text' },
  { id: 'upload', label: 'Upload PDF' },
  { id: 'topic', label: 'Topic' },
];

export default function InputTabs({ onTextChange, inputText, disabled }) {
  const [activeTab, setActiveTab] = useState('paste');
  const [fileName, setFileName] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setParseError('Please upload a PDF file.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setParseError('File is too large. Maximum size is 20 MB.');
      return;
    }

    setParseError('');
    setParsing(true);
    setFileName(file.name);

    try {
      const text = await extractTextFromPDF(file);
      onTextChange(text);
    } catch (err) {
      setParseError(err.message);
      onTextChange('');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="w-full fade-in" id="input-tabs">
      {/* Tab headers */}
      <div className="flex gap-1 mb-4 border-b border-border-subtle">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id);
              setParseError('');
            }}
            disabled={disabled}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative
              ${activeTab === tab.id
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-primary'}
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[200px]">
        {/* Paste text tab */}
        {activeTab === 'paste' && (
          <div>
            <textarea
              id="input-paste"
              value={inputText}
              onChange={(e) => onTextChange(e.target.value)}
              disabled={disabled}
              placeholder="Paste your notes, lecture transcript, article, or any text you want to study..."
              className="w-full h-48 bg-surface border border-border-subtle rounded-card p-4 text-text-primary
                placeholder:text-text-muted/60 text-sm font-light leading-relaxed resize-none
                focus:outline-none focus:border-accent transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="mt-2 text-xs text-text-muted text-right">
              {inputText.length.toLocaleString()} characters
            </div>
          </div>
        )}

        {/* Upload PDF tab */}
        {activeTab === 'upload' && (
          <div>
            <div
              className={`drop-zone flex flex-col items-center justify-center gap-3 p-10 cursor-pointer
                ${dragOver ? 'drag-over' : ''}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !disabled && fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              id="drop-zone"
            >
              {parsing ? (
                <>
                  <div className="spinner" />
                  <p className="text-text-muted text-sm">Extracting text from PDF...</p>
                </>
              ) : fileName && inputText ? (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="1.5">
                    <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <p className="text-text-primary text-sm font-medium">{fileName}</p>
                  <p className="text-text-muted text-xs">{inputText.length.toLocaleString()} characters extracted</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileName('');
                      onTextChange('');
                    }}
                    className="text-xs text-text-muted hover:text-error transition-colors mt-1"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
                    <polyline points="17,8 12,3 7,8" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
                  </svg>
                  <p className="text-text-muted text-sm">
                    Drop a PDF here or <span className="text-accent">browse</span>
                  </p>
                  <p className="text-text-muted/60 text-xs">Max 20 MB</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
              id="file-input"
            />
            {parseError && (
              <p className="mt-3 text-error text-sm flex items-center gap-2" id="parse-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {parseError}
              </p>
            )}
          </div>
        )}

        {/* Topic tab */}
        {activeTab === 'topic' && (
          <div>
            <input
              id="input-topic"
              type="text"
              value={inputText}
              onChange={(e) => onTextChange(e.target.value)}
              disabled={disabled}
              placeholder="e.g., Photosynthesis, React hooks, World War 2, Linear algebra..."
              className="w-full bg-surface border border-border-subtle rounded-card px-4 py-3.5 text-text-primary
                placeholder:text-text-muted/60 text-sm font-light
                focus:outline-none focus:border-accent transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-3 text-text-muted/60 text-xs">
              The AI will generate flashcards from its own knowledge about this topic.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
