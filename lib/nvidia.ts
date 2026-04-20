import axios from 'axios';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY!;

interface NvidiaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface NvidiaResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function callNvidiaAPI(messages: NvidiaMessage[]): Promise<string> {
  if (!NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY is not configured');
  }

  const response = await axios.post<NvidiaResponse>(
    NVIDIA_API_URL,
    {
      model: 'meta/llama-3.1-8b-instruct',
      messages,
      max_tokens: 4096,
      temperature: 0.20,
      top_p: 0.70,
      frequency_penalty: 0.00,
      presence_penalty: 0.00,
      stream: false,
    },
    {
      headers: {
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 120000,
    }
  );

  return response.data.choices[0]?.message?.content ?? '';
}

export async function generateFlashcards(text: string): Promise<string> {
  const prompt = `You are an expert teacher and cognitive science specialist.

Convert the following content into high-quality flashcards.

Rules:
- Cover all important concepts
- Include definitions, explanations, and reasoning
- Avoid trivial questions
- Keep answers concise (2-4 lines max)
- Generate between 8 and 20 flashcards depending on content length

Return ONLY valid JSON array with no markdown, no explanation, no code blocks:
[
  {
    "question": "...",
    "answer": "...",
    "difficulty": "easy | medium | hard",
    "type": "definition | concept | application | reasoning"
  }
]

Content:
${text}`;

  return callNvidiaAPI([{ role: 'user', content: prompt }]);
}

export async function simplifyAnswer(answer: string): Promise<string> {
  const prompt = `You are a patient teacher. Explain the following concept in simpler terms that a high school student can understand. Be concise (3-5 sentences max), use simple language, and give a real-world example if helpful.

Concept to simplify:
${answer}`;

  return callNvidiaAPI([{ role: 'user', content: prompt }]);
}
