const pdfParse = require('pdf-parse');

/**
 * PDF text extraction utility for Next.js API routes
 * Uses pdf-parse to extract and clean text from PDF buffers
 */

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return cleanText(data.text);
}

/**
 * Clean and normalize extracted PDF text
 */
function cleanText(raw: string): string {
  return raw
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive whitespace / blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Remove common PDF artifacts
    .replace(/\f/g, '\n')
    // Collapse multiple spaces
    .replace(/ {2,}/g, ' ')
    // Trim each line
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim();
}

/**
 * Truncate text to approximate token limit.
 * GPT-4 and Gemma use ~4 chars per token.
 * We target ~6000 tokens → ~24000 chars for safety.
 */
export function truncateText(text: string, maxChars = 24000): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[...content truncated for processing...]';
}
