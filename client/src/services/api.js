export async function generateFlashcards({ text, numCards, difficulty, cardStyle }) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, numCards, difficulty, cardStyle }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to generate flashcards.');
  }

  return data.cards;
}
