# FlashAI — AI Flashcard Generator

Generate study flashcards instantly with AI. Paste your notes, upload a PDF, or enter any topic.

## Quick start

### 1. Clone & install

```bash
npm run install:all
```

### 2. Configure API key

```bash
cp server/.env.example server/.env
# Edit server/.env and add your Anthropic API key
```

### 3. Run development servers

```bash
npm run dev
```

This starts both the Vite dev server (port 5173) and the Express API server (port 3001).

## Features

- **3 input modes** — paste text, upload PDF, or enter a topic
- **AI-powered generation** — uses Claude to create high-quality flashcards
- **Study mode** — 3D flip cards with keyboard shortcuts
- **Grid view** — see all cards at once
- **Scoring** — track your progress with "got it" / "still learning"
- **Export** — download as JSON, CSV, or copy for Anki import
- **Customizable** — choose card count, difficulty, and style

## Keyboard shortcuts (study mode)

| Key | Action |
|-----|--------|
| Space | Flip card |
| → | Next card |
| ← | Previous card |
| G | Got it (mark correct) |
| B | Still learning (mark wrong) |

## Tech stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Express (API proxy)
- **AI:** Anthropic Claude (claude-sonnet-4-6)
- **PDF parsing:** pdfjs-dist (browser-side)

## License

MIT
