# RecallAI — AI-Powered Flashcard Learning System

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0d1b4b:000000&height=250&section=header&text=RecallAI&fontSize=90&fontColor=6c63ff&desc=AI-Powered%20Flashcard%20Learning%20System&descAlignY=70&descSize=24&animation=fadeIn" width="100%" alt="RecallAI Header" />
  
  <img src="https://readme-typing-svg.demolab.com?font=Share+Tech+Mono&size=20&pause=1000&color=00D4C8&center=true&vCenter=true&width=600&lines=Convert+PDFs+into+intelligent+flashcards.;Master+any+subject+with+Spaced+Repetition.;Learn+faster+with+AI-powered+active+recall." alt="Typing SVG" />
</div>

<br/>

<div align="center">
  
[![Live Demo](https://img.shields.io/badge/Live_Demo-Watch_Now-6c63ff?style=for-the-badge&logo=vercel&logoColor=white)](https://recall-ai-flax.vercel.app/)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20Now-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https://github.com/kinshukkush/recallai)

</div>

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

---

<div align="center">
  <h3 style="font-size: 1.5em; font-weight: bold;">
    ✨ RecallAI transforms your study materials into interactive flashcard decks instantly
  </h3>
  <p style="font-size: 1.1em; color: #6c63ff;">
    Powered by advanced AI models • SM-2 Spaced Repetition • Real-time Analytics
  </p>
</div>

---

## 🚀 Quick Start

```bash
git clone https://github.com/kinshukkush/recallai.git
cd recallai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Core Features

| Feature | Description |
| :--- | :--- |
| 📄 **PDF Upload & Parsing** | Drag and drop any PDF — textbooks, notes, papers with automatic text extraction |
| 🤖 **AI Flashcard Generation** | Advanced AI creates targeted Q&A with dynamic difficulty levels |
| 🔄 **Active Recall Practice** | Animated 3D flip cards test your knowledge one question at a time |
| ⚡ **Spaced Repetition (SM-2)** | Proven algorithm schedules reviews at optimal intervals |
| 📊 **Progress Dashboard** | Track mastery, weak spots, and cards due today with beautiful analytics |
| 💡 **"Explain Better" AI Mode** | Ask AI to simplify complex answers with plain language |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│          RecallAI Processing Pipeline                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [PDF Upload] → [Parse & Extract] → [AI Generation]     │
│                                         ↓               │
│                                  [Supabase DB]          │
│                                         ↓               │
│          [Review Practice] ← [SM-2 Algorithm]           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

</div>

---

## 🤖 AI Integration

### Primary Model: Google Gemma-4 (via Ollama)

RecallAI leverages **Ollama with Gemma-4** for local, privacy-first AI processing:

#### Why Ollama + Gemma-4?

- **🔐 Privacy**: All processing happens locally on your machine
- **⚡ Performance**: Lightning-fast inference with optimized models
- **💰 Cost-effective**: No expensive API calls
- **🎯 Specialized**: Fine-tuned for reasoning and code generation

#### Setup Instructions

1. **Install Ollama** from [ollama.ai](https://ollama.ai)

2. **Pull the Gemma-4 model**:
   ```bash
   ollama pull gemma4
   ```

3. **Alternative models available**:
   ```bash
   ollama pull gemma4:26b      # Mixture of Experts (4B active)
   ollama pull gemma4:e4b      # Efficient 4B variant
   ollama pull gemma4:e2b      # Efficient 2B variant (mobile)
   ```

4. **Run with Claude Code** (optional IDE integration):
   ```bash
   ollama launch claude --model gemma4
   ```

5. **Environment Configuration**:
   ```env
   # .env.local
   OLLAMA_API_URL=http://localhost:11434
   OLLAMA_MODEL=gemma4
   ```

#### Model Specifications

| Model | Size | Context | Best For |
| :--- | :--- | :--- | :--- |
| **gemma4:latest** | 9.6GB | 128K | Balanced performance |
| **gemma4:26b** | 18GB | 256K | High-quality output |
| **gemma4:31b** | 20GB | 256K | Frontier performance |
| **gemma4:e4b** | 7.2GB | 128K | Efficient inference |
| **gemma4:e2b** | 5.1GB | 128K | Mobile/Edge devices |

#### Key Capabilities

✅ **Reasoning** - Multi-step problem solving  
✅ **Coding** - Generate and explain code  
✅ **Vision** - Image understanding (supported models)  
✅ **Audio** - Audio processing (supported models)  
✅ **Tools** - Native function-calling support  
✅ **Native System Prompts** - Structured conversations  

#### Performance Benchmarks

| Benchmark | Gemma-4 31B | Gemma-4 E4B |
| :--- | :--- | :--- |
| MMLU Pro | 85.2% | 69.4% |
| AIME 2026 | 89.2% | 42.5% |
| LiveCodeBench | 80.0% | 52.0% |
| Codeforces ELO | 2150 | 940 |

---

## 📦 API Endpoints

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/generate-cards` | `POST` | Process PDF and generate AI flashcards |
| `/api/review-card` | `POST` | Submit review and apply SM-2 algorithm |
| `/api/explain` | `POST` | Simplify complex flashcard answers |
| `/api/decks` | `GET` | Retrieve all user decks |
| `/api/decks` | `DELETE` | Delete deck and associated cards |
| `/api/decks/[id]` | `GET` | Fetch specific deck with cards |

---

## 🔧 Configuration & Setup

### Prerequisites

- Node.js 18+ & npm
- Ollama (for local AI processing)
- Supabase account

### Environment Variables

Create a `.env.local` file:

```env
# Ollama Configuration
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=gemma4

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
SUPABASE_DB_PASSWORD=your_db_password
```

### Database Setup

1. Create a Supabase project
2. Run the schema from `supabase/schema.sql`
3. Configure RLS policies (included in schema)

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/kinshukkush/recallai.git
cd recallai

# 2. Install dependencies
npm install

# 3. Start Ollama (in separate terminal)
ollama serve

# 4. Pull Gemma model
ollama pull gemma4

# 5. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your settings

# 6. Start development server
npm run dev
```

---

## 📊 Data Flow

```
User PDF Upload
       ↓
   PDF Parse
       ↓
   Extract Text
       ↓
  Ollama/Gemma-4 AI
       ↓
Generate Q&A Cards
       ↓
Store in Supabase
       ↓
  User Reviews
       ↓
   SM-2 Algorithm
       ↓
Update Intervals
```

---

## 🎨 UI/UX Features

- ✨ **3D Card Animations** - Smooth flip and tilt effects
- 🌌 **Glassmorphism Design** - Modern frosted glass aesthetic
- 🎯 **Responsive Layouts** - Mobile-first design
- ⚡ **Framer Motion** - Smooth entrance and hover animations
- 🌈 **Gradient Accents** - Eye-catching color transitions

---

## 🚀 Performance Optimizations

- **Image Optimization** - Next.js automatic image compression
- **Code Splitting** - Dynamic imports for faster load times
- **Caching Strategy** - Efficient cache headers
- **Database Indexing** - Optimized Supabase queries

---

## 🔐 Security

- ✅ Row-Level Security (RLS) in Supabase
- ✅ Environment variable protection
- ✅ Secure API route handling
- ✅ Input validation and sanitization

---

## 📈 Learning Analytics

RecallAI provides comprehensive insights:

- **Mastery Percentage** - Overall progress tracking
- **Due Cards** - Cards scheduled for today
- **Learning Streak** - Consistent practice motivation
- **Difficulty Breakdown** - Identify weak areas
- **Time Analytics** - Study duration trends

---

## 🎓 How It Works

1. **Upload** - Drag and drop your PDF
2. **Parse** - RecallAI extracts and cleans text
3. **Generate** - Gemma-4 AI creates smart questions
4. **Review** - Practice with animated flashcards
5. **Learn** - SM-2 adapts to your pace

---

## 🤝 Contributing

Contributions are welcome! Please follow our code style and submit PRs with clear descriptions.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📝 License

MIT License - see LICENSE file for details


---

## 👨‍💻 Developer

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

<div align="center">

### **Kinshuk Saxena**

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=18&pause=1000&color=6c63ff&center=true&vCenter=true&width=500&lines=Frontend+Developer;HTML+%7C+CSS+%7C+JavaScript+Enthusiast;React+%7C+Next.js+%7C+TypeScript;AI+%2B+ML+Enthusiast+%F0%9F%8E%B5;Always+Learning+%F0%9F%9A%80" alt="Typing SVG" />

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-kinshukkush-181717?style=for-the-badge&logo=github)](https://github.com/kinshukkush)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-kinshuk--saxena-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/kinshuk-saxena-/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit_Website-6c63ff?style=for-the-badge&logo=google-chrome&logoColor=white)](https://portfolio-frontend-mu-snowy.vercel.app/)
[![Email](https://img.shields.io/badge/Email-kinshuksaxena3%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kinshuksaxena3@gmail.com)
[![Phone](https://img.shields.io/badge/Phone-%2B91%209057538521-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](tel:+919057538521)

<br/>

**Made with ❤️ and passion for education by Kinshuk Saxena**

⭐ **Star this repo if you found it helpful!** ⭐

<a href="https://github.com/kinshukkush">
  <img src="https://img.shields.io/github/followers/kinshukkush?style=social" alt="GitHub Followers"/>
</a>

</div>

<img src="https://readme-typing-svg.demolab.com?font=Share+Tech+Mono&size=16&pause=1000&color=6c63ff&center=true&vCenter=true&width=500&lines=Transforming+Education+with+AI+%26+Spaced+Repetition" alt="Footer" />

<img src="https://capsule-render.vercel.app/api?type=waving&color=000000:0d1b4b&height=150&section=footer&animation=fadeIn" width="100%" alt="Footer" />
