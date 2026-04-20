<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0d1b4b:000000&height=250&section=header&text=RecallAI&fontSize=90&fontColor=6c63ff&desc=AI-Powered%20Flashcard%20Learning%20System&descAlignY=70&descSize=24&animation=fadeIn" width="100%" alt="RecallAI Header" />

<img src="https://readme-typing-svg.demolab.com?font=Share+Tech+Mono&size=20&pause=1000&color=00D4C8&center=true&vCenter=true&width=600&lines=Convert+PDFs+into+intelligent+flashcards.;Master+any+subject+with+Spaced+Repetition.;Learn+faster+with+AI-powered+active+recall." alt="Typing SVG" />

<br/><br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-Watch_Now-6c63ff?style=for-the-badge&logo=vercel&logoColor=white)](https://your-vercel-link.vercel.app)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy%20Now-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https://github.com/kinshukkush/recallai)

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

</div>

<br/>

<div align="center">
  
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║   RecallAI is a production-ready web application that instantly        ║
║   transforms your study materials into interactive flashcard decks.    ║
║   Powered by the NVIDIA gemma-3n-e4b-it model and SM-2                 ║
║   spaced repetition, it guarantees you never forget what you read.     ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝

</div>

<br/>

## ◈ Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![NVIDIA AI](https://img.shields.io/badge/NVIDIA_NIM-76B900?style=flat-square&logo=nvidia&logoColor=white)

</div>

## ◈ Key Features

| Feature | Description |
| :--- | :--- |
| **PDF Extraction Engine** | Automatically extracts and cleans text from any PDF using `pdf-parse`. |
| **AI Flashcard Generation** | Powered by Gemma-3, generating precise Q&A with dynamic difficulty levels. |
| **Spaced Repetition (SM-2)** | Adapts card intervals intelligently based on user rating (`Again`, `Hard`, `Good`, `Easy`). |
| **"Explain Better" Mode** | Distills complex answers into simple, digestible terms using AI. |
| **Real-time Analytics** | Provides insights on tracked learning progress, mastery percentage, and daily due counts. |
| **Premium 3D UI/UX** | Dark glassmorphism aesthetics with interactive 3D flip card animations. |

## ◈ Data Architecture

```mermaid
graph TD
    A[Client UI] -->|Upload PDF| B[Next.js API Route]
    B -->|Parse Buffer| C(pdf-parse Module)
    C -->|Extracted Text| D[NVIDIA NIM API\ngemma-3n-e4b-it]
    D -->|Generated JSON Cards| B
    B -->|Save Deck & Cards| E[(Supabase PostgreSQL)]
    A -->|Fetch Cards| E
    A -->|Submit Rating| F[SM-2 Algorithm]
    F -->|Update Intervals| E
```

## ◈ API Endpoints

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/generate-cards` | `POST` | Processes a PDF upload and uses AI to generate a deck. |
| `/api/review-card` | `POST` | Applies SM-2 algorithm to a reviewed card and updates the DB. |
| `/api/explain` | `POST` | Calls NVIDIA API to simplify a complex flashcard answer. |
| `/api/decks` | `GET` | Retrieves all decks, calculating daily due counts. |
| `/api/decks` | `DELETE` | Deletes a deck and cascades to remove all associated cards. |
| `/api/decks/[id]` | `GET` | Fetches a specific deck along with its corresponding internal cards. |

## ◈ How to Run Locally

### 1. Clone & Install
```bash
git clone https://github.com/kinshukkush/recallai.git
cd recallai
npm install
```

### 2. Configure Environment
Create a `.env.local` file with the following keys:
```env
NVIDIA_API_KEY=your_nvidia_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_DB_PASSWORD=your_db_password
```

### 3. Setup Database
Run the schema script located in `supabase/schema.sql` within your Supabase SQL Editor to generate the tables and RLS policies.

### 4. Start Development Server
```bash
npm run dev
```

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%" />

<br/>

<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Share+Tech+Mono&size=16&pause=1000&color=6c63ff&center=true&vCenter=true&width=500&lines=Developed+with+%E2%9D%A4+by+Kinshuk+Saxena" alt="Developed by" />

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kinshukkush)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/kinshuk-saxena-/)
[![Portfolio](https://img.shields.io/badge/Portfolio-00D4C8?style=for-the-badge&logo=vercel&logoColor=white)](https://kinshuk.unaux.com)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:kinshuksaxena3@gmail.com)

*“Bridging complex AI with intuitive design.”*

⭐ **If you like this project, please consider giving it a star!** ⭐

<img src="https://capsule-render.vercel.app/api?type=waving&color=000000:0d1b4b&height=150&section=footer&animation=fadeIn" width="100%" alt="Footer" />

</div>
