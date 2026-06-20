export async function generateFlashcards({ text, numCards, difficulty, cardStyle }) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, numCards, difficulty, cardStyle }),
  });

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate flashcards.');
    }
    return data.cards;
  } else {
    const textData = await res.text();
    // For Vercel 404s or proxy errors, throw a clear error
    if (res.status === 404 && textData.includes('The page could not be found')) {
      throw new Error('API Endpoint not found. Ensure the backend server is running and connected.');
    }
    throw new Error(`Server returned an invalid response (${res.status}): ${textData.slice(0, 50)}...`);
  }
}

