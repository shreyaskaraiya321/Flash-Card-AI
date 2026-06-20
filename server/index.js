import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

/* ── Rate limiter (simple in-memory) ─────────────────────────── */
const rateLimit = new Map();
const RATE_WINDOW = 60_000; // 1 minute
const RATE_MAX = 10;        // max requests per window

function checkRate(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count++;
  }
  rateLimit.set(ip, entry);
  return entry.count <= RATE_MAX;
}

/* ── Health check ────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ── Generate flashcards ─────────────────────────────────────── */
app.post('/api/generate', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!checkRate(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment.' });
  }

  const { text, numCards = 10, difficulty = 'Intermediate', cardStyle = 'Q&A' } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide text, a topic, or PDF content to generate flashcards.' });
  }

  if (text.trim().length > 50_000) {
    return res.status(400).json({ error: 'Input text is too long. Please limit to 50,000 characters.' });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(500).json({ error: 'Google API key is not configured. Add GOOGLE_API_KEY to server/.env' });
  }

  const systemPrompt = `You are a flashcard generation expert. Return ONLY a valid JSON array with no markdown, no preamble, no explanation.
Format: [{"q": "question", "a": "answer"}, ...]
Rules:
- Generate exactly ${numCards} flashcards
- Questions must be clear and specific
- Answers: 1-3 sentences max, accurate
- Card style: ${cardStyle}
- If style is "Fill-in-the-blank": use _____ in q, full sentence in a
- If style is "Term→Definition": q is the term, a is the definition
- If style is "Q&A": q is a question, a is the answer
- Match difficulty level: ${difficulty}
- Do not number the questions
- Respond with ONLY the JSON array, nothing else`;

  const userPrompt = `Generate ${numCards} ${difficulty.toLowerCase()}-level ${cardStyle} flashcards from the following content:\n\n${text.trim()}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text() || '';

    // Try to parse JSON from the response
    let cards;
    try {
      cards = JSON.parse(responseText);
    } catch {
      // Try to extract JSON array from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse flashcards from AI response.');
      }
    }

    if (!Array.isArray(cards) || cards.length === 0) {
      throw new Error('AI returned an invalid response. Please try again.');
    }

    // Validate card structure
    const validCards = cards
      .filter(c => c && typeof c.q === 'string' && typeof c.a === 'string')
      .map(c => ({ q: c.q.trim(), a: c.a.trim() }));

    if (validCards.length === 0) {
      throw new Error('No valid flashcards were generated. Please try again.');
    }

    res.json({ cards: validCards });
  } catch (err) {
    console.error('Generation error:', err.message);

    if (err.message && err.message.includes('API key not valid')) {
      return res.status(401).json({ error: 'Invalid API key. Check your GOOGLE_API_KEY.' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'API rate limit exceeded. Please wait and try again.' });
    }
    if (err.status === 529) {
      return res.status(503).json({ error: 'Claude API is temporarily overloaded. Please try again later.' });
    }

    res.status(500).json({
      error: err.message || 'An unexpected error occurred while generating flashcards.',
    });
  }
});

if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`\n  ⚡ FlashAI server running on http://localhost:${PORT}\n`);
  });
}

export default app;
