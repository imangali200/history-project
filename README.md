# 🏛️ QAZHISTORY & HISTORY WORLD (SDU Platform)

> "Travel Through Time. Discover History. Become a Legend."

An interactive, gamified Kazakh History learning platform combining Duolingo-style bite-sized curriculum, 10 RPG adventure game modes in History World, SDU University student portal authentication, and an AI Tarihshy tutor.

---

## 🚀 Features

- **SDU University Integration**: Student ID authentication (`FEAS`, `FEH`, etc.) with course, specialty, and role tracking.
- **Duolingo-style Learning Path**: Historical eras (Stone Age to Modern Kazakhstan) with interactive questions, hearts, and XP.
- **History World (10 Gamified Modes)**:
  1. Time Travel Portal
  2. History Detective
  3. Battle Arena (RPG Turn-Based)
  4. Hall of Heroes
  5. Ancient World Map Explorer
  6. Timeline Temple
  7. Hero's Journey (Decision Simulator)
  8. Archaeologist Excavation
  9. Kingdom Builder
  10. Ancient Escape Room
- **AI Tarihshy**: Conversational historical mentor powered by modern LLMs.
- **Weekly Leagues & Leaderboard**: Real-time rankings with SDU faculty filters.
- **Verifiable Certificates**: Dynamic PDF certificates with QR codes.

---

## 🛠️ Tech Stack

### Frontend:
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS (Material 3 Steppe Design System)
- **Audio**: Web Audio API Sound Effects Synthesizer
- **Icons**: Google Material Symbols Outlined

### Backend:
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL (Supabase) via Prisma ORM
- **Cache**: Redis
- **Auth**: Passport JWT + SDU Student Verification
- **Docs**: Swagger OpenAPI (`/api/docs`)

---

## 📦 Getting Started

### 1. Frontend Setup:
```bash
npm install
npm run dev
```
Runs at `http://localhost:3000`.

### 2. Backend Setup:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```
Runs at `http://localhost:4000/api` with Swagger docs at `http://localhost:4000/api/docs`.

---

## 📄 License
SDU QazHistory Team. All rights reserved.
