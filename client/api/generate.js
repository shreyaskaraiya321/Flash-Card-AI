import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { text, numCards = 10, difficulty = 'Intermediate', cardStyle = 'Q&A' } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Please provide text, a topic, or PDF content to generate flashcards.' });
    }

    if (text.trim().length > 50_000) {
      return res.status(400).json({ error: 'Input text is too long. Please limit to 50,000 characters.' });
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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text() || '';

    let cards;
    try {
      cards = JSON.parse(responseText);
    } catch {
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

    const validCards = cards
      .filter(c => c && typeof c.q === 'string' && typeof c.a === 'string')
      .map(c => ({ q: c.q.trim(), a: c.a.trim() }));

    if (validCards.length === 0) {
      throw new Error('No valid flashcards were generated. Please try again.');
    }

    return res.status(200).json({ cards: validCards });
  } catch (error) {
    console.error('Generation error:', error.message);
    if (error.message && error.message.includes('API key not valid')) {
      return res.status(401).json({ error: 'Invalid API key.' });
    }
    return res.status(500).json({ error: error.message });
  }
}
