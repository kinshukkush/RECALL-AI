# 🧠 RecallAI — Interview Preparation & AI Development Guide

> Tailored for: **Cuemath AI Builder — Product Team Internship**
> Drive Code: `TC.15196.2026.59059` | Drive Date: Apr 15, 2026
> Stipend: ₹25,000/month | PPO CTC: ₹6.5–7 LPA

---

## 📌 Table of Contents

1. [About the Company & Role](#about-cuemath)
2. [RecallAI — Project Deep-Dive](#recallai-project)
3. [Tech Stack Reference](#tech-stack)
4. [Claude Code — AI Coding Assistant](#claude-code)
5. [Ollama — Local LLM Runner](#ollama)
6. [AI/LLM Integration Patterns](#llm-integration-patterns)
7. [Prompt Engineering Techniques](#prompt-engineering)
8. [SM-2 Spaced Repetition Algorithm](#sm-2-algorithm)
9. [Interview Strategy & Talking Points](#interview-strategy)
10. [Common Interview Questions & Answers](#common-questions)
11. [System Design for AI Products](#system-design)

---

## 1. About Cuemath & Role {#about-cuemath}

### Company Mission
Cuemath makes math learning engaging and effective for students globally via tech-driven innovation — both online and offline platforms.

### AI Builder Role Expectations
- Build AI-powered learning products **end-to-end**: frontend, backend, DB, APIs, LLM integrations, deployment
- Work directly with the product team (not just engineering)
- Own features from idea → deployed product
- Prioritize **user experience**, not just working code

### Selection Process
| Round | Description |
|-------|-------------|
| Registration | Short application form |
| CV Shortlisting | Portfolio + project quality |
| Assignment | Build 1 of 3 real problems in 1 week → deploy it |
| HR Interview | Communication, motivation, cultural fit |
| Personal Interview | Technical deep-dive on your build |

### What They Want to See in Your Assignment
- ✅ **Live deployed link** (Vercel, Railway, Render, etc.)
- ✅ **Video walkthrough** (Loom, 2–3 min)
- ✅ **Write-up** explaining decisions, trade-offs, next steps
- ✅ AI/LLM actually powering the core feature — not as an add-on

---

## 2. RecallAI — Project Deep-Dive {#recallai-project}

### What is RecallAI?
An AI-powered flashcard learning system that converts any PDF into a smart study deck using spaced repetition and active recall.

### Core Features
| Feature | How it Works | AI Component |
|---------|-------------|-------------|
| PDF Parsing | `pdf-parse` or `pdfjs-dist` extracts text | None (preprocessing) |
| AI Card Generation | Sends extracted text to LLM | GPT-4o / Gemini prompt → Q&A JSON |
| Active Recall | 3D flip card animation | UX design |
| Spaced Repetition | SM-2 algorithm calculates `interval`, `ease_factor` | Pure algorithm |
| "Explain Better" | User clicks → LLM simplifies the answer | LLM API call |
| Progress Dashboard | Supabase queries aggregate stats | None (DB query) |

### Architecture

```
[User] → [Next.js Frontend]
              ↓ /api/generate-cards
         [PDF Parser] → [LLM API] → [Supabase DB]
              ↓ /api/review-card
         [SM-2 Calculator] → [Update card in Supabase]
              ↓ /api/explain
         [LLM API → Simplified Answer]
```

### Key Files
```
project/
├── app/
│   ├── page.tsx              # Landing page with feature cards
│   ├── upload/page.tsx       # PDF upload → card generation
│   ├── decks/page.tsx        # All decks library
│   ├── deck/[id]/page.tsx    # Individual deck with card list
│   ├── review/[id]/page.tsx  # Active review session (SM-2)
│   ├── dashboard/page.tsx    # Progress analytics
│   └── globals.css           # Global design system (3D glassmorphic)
├── components/
│   ├── FlashCard.tsx         # 3D flip card component
│   ├── RatingButtons.tsx     # Again/Hard/Good/Easy rating buttons
│   ├── Navbar.tsx            # Glassmorphic navigation
│   ├── DeckCard.tsx          # Deck preview card
│   └── StatsCard.tsx         # Dashboard stat cards
├── lib/
│   └── supabase.ts           # Supabase client
├── app/api/
│   ├── generate-cards/       # POST: PDF text → LLM → flashcards
│   ├── decks/                # GET/DELETE: deck management
│   ├── review-card/          # POST: submit rating, update SM-2
│   └── explain/              # POST: "Explain Better" endpoint
└── types/index.ts            # Card, Deck, Rating TypeScript types
```

### Running Locally
```bash
cd project
npm install
npm run dev        # Start Next.js dev server on :3000

# Required environment variables in .env.local:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
OPENAI_API_KEY=sk-...        # or GOOGLE_GENERATIVE_AI_API_KEY
```

---

## 3. Tech Stack Reference {#tech-stack}

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | Full-stack, SSR, API routes, deploy on Vercel |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS + Custom CSS | Utility classes + design tokens |
| Database | Supabase (PostgreSQL) | Managed DB with realtime + auth |
| AI/LLM | OpenAI API / Google Gemini | Card generation and explanations |
| PDF Parsing | `pdf-parse` / `pdfjs-dist` | Extract text from uploaded PDFs |
| Animations | Framer Motion | 3D flip cards, page transitions |
| State | React useState/useCallback | Client-side session state |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## 4. Claude Code — AI Coding Assistant {#claude-code}

Claude Code is Anthropic's agentic CLI coding tool that can read, write, and execute code autonomously.

### Installation
```bash
npm install -g @anthropic-ai/claude-code
```

### Authentication
```bash
claude login          # Opens browser OAuth with Anthropic account
claude --version      # Verify installation
```

### Key CLI Commands
```bash
# Start interactive session (REPL-style)
claude

# Run with a specific task (one-shot)
claude "add a dark mode toggle to the navbar"

# Run in non-interactive mode (CI/scripts)
claude --non-interactive "fix all TypeScript errors"

# Point Claude at specific files
claude "refactor this file" --file src/components/Card.tsx

# With custom system prompt
claude --system-prompt "You are an expert in Next.js App Router" "add SSR to this page"

# Continue from last session
claude --continue

# Show cost estimate before running
claude --dry-run "rewrite the entire auth system"
```

### Effective Patterns with Claude Code
```bash
# 1. Give context-rich, specific prompts
claude "The RatingButtons component at components/RatingButtons.tsx uses 
        Tailwind grid classes. Fix the mobile layout so 4 buttons show 
        in 2x2 grid on screens below md breakpoint"

# 2. Ask for explanations along with code
claude "Implement SM-2 spaced repetition in lib/sm2.ts and explain 
        each parameter"

# 3. Iterative refinement
claude "The flashcard flip animation has a bug where backface-visibility 
        isn't working in Safari. Fix it"

# 4. Generate test cases
claude "Write Jest tests for the SM-2 algorithm edge cases: 
        first review, ease < 1.3, rating=0"
```

### Claude Code Best Practices
- **Be specific about file paths** — Claude works better when you name exact files
- **Describe the current broken behavior** before asking for the fix
- **One concern at a time** — avoid asking Claude to fix 10 things in one prompt
- **Check the diff** — always review what Claude changed before accepting
- **Use `--dry-run`** to see the plan without executing

---

## 5. Ollama — Local LLM Runner {#ollama}

Ollama lets you run LLMs (Llama, Mistral, Gemma, DeepSeek, etc.) locally on your machine — no API key needed.

### Installation
```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows — download installer from https://ollama.com
# Or via winget:
winget install Ollama.Ollama
```

### Essential Commands
```bash
# List available models
ollama list

# Pull a model (downloads it locally)
ollama pull llama3.2          # Meta Llama 3.2 (3B, fast)
ollama pull llama3.2:8b       # 8B variant (more capable)
ollama pull mistral           # Mistral 7B (great for code)
ollama pull gemma2:9b         # Google Gemma 2 9B
ollama pull deepseek-r1:7b    # DeepSeek reasoning model
ollama pull codellama         # Code-specialized Llama
ollama pull phi3              # Microsoft Phi-3 (small, fast)
ollama pull nomic-embed-text  # Embedding model for RAG

# Run a model interactively
ollama run llama3.2
ollama run mistral

# Run with a single prompt (non-interactive)
ollama run llama3.2 "Explain spaced repetition in simple terms"

# Start Ollama server (runs on localhost:11434)
ollama serve

# Remove a model
ollama rm llama3.2

# Show model info
ollama show llama3.2

# Pull and immediately run
ollama run llama3.2:latest "What is the SM-2 algorithm?"
```

### Using Ollama API (HTTP)
```bash
# Chat completion
curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [
    { "role": "user", "content": "Create 5 flashcards from this text: ..." }
  ],
  "stream": false
}'

# Generate (raw completion)
curl http://localhost:11434/api/generate -d '{
  "model": "mistral",
  "prompt": "Create flashcard Q&A pairs from: ...",
  "stream": false
}'

# List local models via API
curl http://localhost:11434/api/tags
```

### Using Ollama in Node.js / Next.js
```typescript
// Install: npm install ollama
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

const response = await ollama.chat({
  model: 'llama3.2',
  messages: [
    {
      role: 'system',
      content: 'You are an expert at creating educational flashcards.'
    },
    {
      role: 'user',
      content: `Create 10 Q&A flashcards from this text:\n\n${pdfText}`
    }
  ],
  format: 'json'  // Force JSON output
});

const cards = JSON.parse(response.message.content);
```

### Ollama for RAG (Retrieval Augmented Generation)
```bash
# Use nomic-embed-text for creating embeddings
ollama pull nomic-embed-text

curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "Spaced repetition improves memory retention"
}'
```

### Model Selection Guide
| Use Case | Recommended Model | Size |
|----------|------------------|------|
| Fast responses | phi3, llama3.2 | 3-4B |
| Quality answers | llama3.2:8b, mistral | 7-8B |
| Code generation | codellama, deepseek-coder | 7B |
| Reasoning | deepseek-r1:7b | 7B |
| Embeddings (RAG) | nomic-embed-text | small |
| Best overall (local) | llama3.1:8b | 8B |

---

## 6. AI/LLM Integration Patterns {#llm-integration-patterns}

### Pattern 1: PDF → Flashcards (RecallAI Core)
```typescript
// app/api/generate-cards/route.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert educator creating high-quality flashcards.
Given text content, create Q&A pairs that test key concepts.
Return ONLY valid JSON: { "cards": [{"question": "...", "answer": "..."}] }
Rules:
- Questions should be specific and testable
- Answers should be concise (1-3 sentences max)
- Focus on the most important concepts
- Vary question types (definition, application, comparison)`;

export async function POST(req: Request) {
  const { text } = await req.json();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Create 15 flashcards from:\n\n${text.slice(0, 8000)}` }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3,  // Lower = more consistent
    max_tokens: 4000
  });
  
  const { cards } = JSON.parse(response.choices[0].message.content!);
  return Response.json({ cards });
}
```

### Pattern 2: "Explain Better" (Simplification)
```typescript
async function explainBetter(question: string, answer: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Simplify this flashcard answer using plain English and a real-world analogy. Be concise.'
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nOriginal Answer: ${answer}\n\nSimplify this:`
      }
    ],
    temperature: 0.5,
    max_tokens: 300
  });
  return response.choices[0].message.content!;
}
```

### Pattern 3: Streaming LLM Responses
```typescript
// For long responses, stream to avoid timeouts
const stream = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  stream: true,
});

// In Next.js App Router
const encoder = new TextEncoder();
const readable = new ReadableStream({
  async start(controller) {
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      controller.enqueue(encoder.encode(text));
    }
    controller.close();
  }
});

return new Response(readable, {
  headers: { 'Content-Type': 'text/event-stream' }
});
```

### Pattern 4: Fallback Chain (OpenAI → Ollama)
```typescript
async function generateCards(text: string) {
  try {
    // Try cloud API first
    return await generateWithOpenAI(text);
  } catch (err) {
    console.warn('OpenAI failed, falling back to Ollama:', err);
    // Fall back to local Ollama
    return await generateWithOllama(text);
  }
}
```

---

## 7. Prompt Engineering Techniques {#prompt-engineering}

### Core Principles

#### 1. Role Prompting
```
"You are an expert cognitive science educator specializing in memory retention..."
```

#### 2. Few-Shot Examples
```
"Create flashcards. Example format:
Q: What is spaced repetition?
A: A learning technique that reviews material at increasing intervals.

Now create 10 cards from: [text]"
```

#### 3. Chain-of-Thought (CoT)
```
"Think step by step:
1. Identify the main concepts in this text
2. For each concept, write a testable question
3. Write a concise, accurate answer
Then return as JSON."
```

#### 4. Structured Output Enforcement
```typescript
// Force JSON with OpenAI
response_format: { type: 'json_object' }

// Force JSON with Ollama
format: 'json'

// Validate with Zod
import { z } from 'zod';
const CardSchema = z.object({
  question: z.string().min(10),
  answer: z.string().min(5),
  difficulty: z.enum(['easy', 'medium', 'hard'])
});
```

#### 5. Context Window Management
```typescript
// Chunk large PDFs
const CHUNK_SIZE = 6000; // ~4500 tokens
const chunks = [];
for (let i = 0; i < text.length; i += CHUNK_SIZE) {
  chunks.push(text.slice(i, i + CHUNK_SIZE));
}

// Process each chunk and combine
const allCards = await Promise.all(
  chunks.map(chunk => generateCards(chunk))
);
```

#### 6. Temperature Guide
| Value | Use Case |
|-------|----------|
| 0.0–0.2 | Factual extraction, JSON formatting |
| 0.3–0.5 | Flashcard generation (consistent + creative) |
| 0.6–0.8 | Creative explanations, examples |
| 0.9–1.0 | Brainstorming, diverse outputs |

---

## 8. SM-2 Spaced Repetition Algorithm {#sm-2-algorithm}

### Core Parameters
- **Interval** (`n`): Days until next review
- **Ease Factor** (`EF`): Multiplier for interval growth (default: 2.5)
- **Repetitions** (`reps`): Times reviewed successfully in sequence

### Rating Scale
| Rating | Score (q) | Meaning |
|--------|-----------|---------|
| Again | 0 | Complete blackout |
| Hard | 2 | Recalled with significant difficulty |
| Good | 3 | Recalled with effort |
| Easy | 4 | Perfect recall |

### Algorithm Logic
```typescript
// lib/sm2.ts
export interface SM2Result {
  interval: number;
  ease_factor: number;
  repetitions: number;
  next_review: string; // ISO date string
}

export function calculateSM2(
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  repetitions: number,
  ease_factor: number,
  interval: number
): SM2Result {
  let newEF = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF); // EF never goes below 1.3
  
  let newInterval: number;
  let newReps: number;
  
  if (quality < 3) {
    // Failed — reset to beginning
    newInterval = 1;
    newReps = 0;
  } else {
    newReps = repetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEF);
    }
  }
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  
  return {
    interval: newInterval,
    ease_factor: newEF,
    repetitions: newReps,
    next_review: nextReview.toISOString().split('T')[0]
  };
}
```

### Why SM-2 Matters (Interview Talking Point)
> "SM-2 ensures students don't waste time reviewing what they already know well, and spend more time on cards they find difficult. It's proven to improve long-term retention by 200-400% compared to massed practice (cramming). This is why RecallAI uses it as the core review scheduler."

---

## 9. Interview Strategy & Talking Points {#interview-strategy}

### Your Build Story (2-minute version)
> "I built RecallAI to solve a real problem I have: I upload a lot of PDFs when studying but never actually review the material effectively. RecallAI takes any PDF, uses GPT-4 to generate targeted flashcards, and then schedules reviews using the SM-2 spaced repetition algorithm — the same algorithm used by Anki, which has decades of research behind it.
>
> The 'Explain Better' feature came from realizing that generated answers are sometimes too terse. So I added an AI endpoint that simplifies any answer in plain English with a real-world analogy.
>
> What I'd ship next: personalized card difficulty detection using response time + accuracy trends, and a collaborative deck sharing feature."

### Questions They'll Likely Ask
1. **"Walk me through how you built this"** → Architecture, key decisions, challenges
2. **"What trade-offs did you make?"** → Local vs cloud AI, Supabase vs SQLite, Next.js routing
3. **"What would you add next?"** → Show product thinking, not just features
4. **"How does the AI actually work?"** → Explain the prompt, model choice, JSON parsing
5. **"What broke and how did you fix it?"** → PDF parsing edge cases, LLM JSON parsing failures

### Showing Product Thinking
Frame everything from the **user's perspective**:
- Not "I built a flashcard generator" but "Students lose 70% of information within a week — RecallAI fights this with SM-2"
- Not "I used GPT-4" but "I chose GPT-4o-mini for the balance of quality and cost — it's 10x cheaper than GPT-4 with 90% of the capability for this task"

---

## 10. Common Interview Questions & Answers {#common-questions}

### Technical

**Q: How did you handle PDF parsing?**
> "I used `pdf-parse` which wraps `pdfjs-dist`. The main challenge was cleaning up the extracted text — PDFs often have inconsistent whitespace, hyphenated line breaks, and headers/footers that pollute the content. I added a text cleaning step that normalizes whitespace and removes very short lines that are likely artifacts."

**Q: How do you prevent bad LLM output?**
> "Three layers: (1) I use `response_format: json_object` with OpenAI to enforce JSON output. (2) I validate the schema with Zod — if a card is missing a question or answer field, I skip it. (3) I use a low temperature (0.3) to reduce hallucinations and keep output consistent."

**Q: Why Next.js instead of a separate backend?**
> "For a solo project with this scope, Next.js App Router's API routes give me co-located backend logic without maintaining a separate service. If I were scaling to multiple teams or needed microservices, I'd split it — but for this, it significantly reduces operational overhead."

**Q: How does the SM-2 algorithm work?**
> See [SM-2 section above](#sm-2-algorithm). Explain EF, interval, how 'again' resets, how 'easy' accelerates.

### Product/Design

**Q: If you had 2 more weeks, what would you build?**
> "Three things: (1) Analytics showing which cards you consistently fail — identify knowledge gaps, not just progress. (2) Deck sharing with a public URL — study groups can use the same AI-generated deck. (3) Mobile-first PWA with offline review mode for studying without internet."

**Q: How would you measure if RecallAI is working?**
> "Key metric: retention rate — if users score higher on cards they've reviewed vs. cards they haven't, the algorithm is working. Secondary metrics: DAU/WAU ratio (habit formation), session length, deck completion rate, and churn after first PDF upload."

---

## 11. System Design for AI Products {#system-design}

### Design a "PDF to Flashcards" System at Scale

```
[Client] → [CDN / Vercel Edge]
              ↓
         [Next.js API] → [Queue (BullMQ/SQS)]
                               ↓ (async)
                    [Worker: PDF Parsing]
                               ↓
                    [Worker: LLM Batching] → [OpenAI API]
                               ↓
                    [Database (Postgres)]
                               ↓
              [WebSocket / Server-Sent Events → Client notified]
```

**Key Design Decisions:**
- **Async processing** for large PDFs (avoid 30s timeout)
- **Chunking** large documents to stay within context window
- **Caching** generated cards by PDF hash — same PDF = same cards
- **Rate limiting** per user to control OpenAI spend
- **Fallback** to open-source model (Llama via Ollama) if API is down

### Cost Optimization
```typescript
// Cache by PDF content hash
import crypto from 'crypto';
const pdfHash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');

// Check cache first
const cached = await db.from('deck_cache').select().eq('pdf_hash', pdfHash).single();
if (cached.data) return cached.data.cards;

// Only call LLM if not cached
const cards = await generateWithLLM(text);
await db.from('deck_cache').insert({ pdf_hash: pdfHash, cards });
```

---

## 🔑 Quick Reference — Key Commands

### Development
```bash
cd project && npm run dev          # Start dev server
npm run build                      # Production build
npm run lint                       # ESLint check
npx tsc --noEmit                   # TypeScript check (no output)
```

### Supabase
```bash
npx supabase init                  # Init local Supabase
npx supabase start                 # Start local Supabase
npx supabase db push               # Push schema migrations
npx supabase gen types typescript  # Generate TypeScript types
```

### Git
```bash
git add -A && git commit -m "feat: fix rating buttons layout"
git push origin main
```

### Vercel Deploy
```bash
npm i -g vercel
vercel login
vercel --prod                      # Deploy to production
vercel env add OPENAI_API_KEY      # Add environment variable
```

### Ollama Quick Start
```bash
ollama serve                       # Start Ollama server
ollama pull llama3.2               # Download model
ollama run llama3.2                # Interactive chat
ollama list                        # See downloaded models
```

---

## 📋 Self-Introduction (for HR Round)

> "Hi, I'm Kinshuk. I'm passionate about building AI-powered tools that solve real learning problems. I've built RecallAI — an intelligent flashcard system that converts any PDF into a spaced repetition study deck using GPT-4 and the SM-2 algorithm.
>
> Beyond RecallAI, I've built an Intel Fusion Dashboard for geospatial intelligence analysis with MongoDB and Leaflet, and a full-stack content tracker with HackerNews API integration.
>
> I'm drawn to Cuemath because you're working on a real problem at scale — making math learning effective for millions of students globally. I want to be an AI Builder who ships features that students actually use to learn better, not just impressive demos."

---

*Last updated: April 2026*
*Prepared for Cuemath AI Builder Internship — Drive Code TC.15196.2026.59059*
