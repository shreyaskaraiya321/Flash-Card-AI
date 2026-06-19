import * as pdfjsLib from 'pdfjs-dist';

// Set worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const pages = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (pageText) pages.push(pageText);
    }

    const fullText = pages.join('\n\n');

    if (!fullText.trim()) {
      throw new Error('No readable text found in this PDF. It may be scanned or image-based.');
    }

    return fullText;
  } catch (err) {
    if (err.message.includes('No readable text')) throw err;
    throw new Error('Failed to parse PDF. The file may be corrupted or password-protected.');
  }
}
