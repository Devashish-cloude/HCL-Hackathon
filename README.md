# LearnPath AI — Intelligent Personalized Learning Platform

LearnPath AI is a full-stack, AI-powered developer learning platform featuring dynamic career roadmaps, skill competency analytics, interactive benchmarking assessments, an AI-powered conversational mentor, and database-persisted user preferences (including Dark and Light themes).

---

## 🏛️ Project Architecture

This application is built as a **single unified full-stack repository** with no separate `client` or `server` directories:

```text
learnpath-ai/
├── src/
│   ├── components/           # Reusable UI components (Sidebar, TopNav, Cards, Modals, Badges)
│   ├── pages/                # Application screens (Dashboard, Path, Skills, Mentor, Explore, Settings)
│   ├── layouts/              # AppLayout and ProtectedRoute
│   ├── hooks/                # Custom React hooks
│   ├── contexts/             # ThemeContext (PostgreSQL synced) & AuthContext
│   ├── services/             # Frontend API services
│   ├── routes/               # App routing configuration
│   ├── types/                # TypeScript models and interfaces
│   ├── lib/                  # Utilities (cn, date helpers)
│   │
│   ├── server/
│   │   ├── controllers/      # Auth, Dashboard, Path, Skills, Assessment, Mentor, User
│   │   ├── routes/           # Express `/api/*` endpoints
│   │   ├── middleware/       # JWT Auth & Error handler
│   │   ├── services/         # Prisma client & AI engines (Mentor, Recommender, Evaluator)
│   │   ├── utils/            # Logger, JWT, Password helpers
│   │   └── index.ts          # Express API server entry point
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── prisma/
│   ├── schema.prisma         # Full PostgreSQL database schema
│   └── seed.ts               # Database seed script matching UI screenshots
│
├── public/                   # Static assets & brand SVG favicon
├── .env                      # Environment variables
├── .env.example
├── docker-compose.yml        # PostgreSQL 16 Alpine container configuration
├── package.json              # Single root package configuration & scripts
├── vite.config.ts            # Vite bundler with API proxy to Express backend
├── tsconfig.json             # TypeScript configuration
└── README.md
```

---

## ⚡ Tech Stack

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
* **Backend**: Express.js, Node.js, TypeScript (via `tsx`)
* **Database & ORM**: PostgreSQL, Prisma ORM
* **Authentication**: JWT, bcrypt password hashing, HTTP-only cookie support
* **AI Engine**: Google Gemini API integration with intelligent heuristic fallback engine

---

## 🚀 Getting Started

### 1. Install Dependencies

From the workspace root directory:

```bash
npm install
```

### 2. Start PostgreSQL Database

Launch PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

### 3. Run Prisma Migrations & Seed Database

```bash
# Push schema to PostgreSQL & generate Prisma Client
npx prisma db push
npx prisma generate

# Seed database with realistic curriculum, skills, and AI conversations
npm run db:seed
```

### 4. Run Development Server

Start both the Vite frontend and Express API concurrently with a single command:

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**  
The Express API will be running at: **http://localhost:5000/api**

---

## 🔑 Demo Account

* **Email**: `devashish@learnpath.ai`
* **Password**: `password123`

---

## 📡 API Endpoints

All backend routes are prefixed with `/api/*`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account & generate AI learning path |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token |
| `POST` | `/api/auth/logout` | Clear user session |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `GET` | `/api/users/preferences` | Retrieve user preferences (theme, target role, daily goal) |
| `PUT` | `/api/users/preferences` | Update & persist theme (`light`/`dark`) & goals to DB |
| `PUT` | `/api/users/profile` | Update profile information |
| `GET` | `/api/dashboard` | Aggregated dashboard state, focus tasks, roadmap track & stats |
| `GET` | `/api/learning-path` | Multi-phase personalized curriculum roadmap |
| `POST` | `/api/learning-path/generate` | AI-generated learning path for chosen target role |
| `GET` | `/api/skills` | Competency breakdown, overall proficiency & gap areas |
| `GET` | `/api/courses` | Explore courses catalog with category filter |
| `GET` | `/api/courses/:slug` | Course syllabus and lesson player data |
| `PATCH`| `/api/progress/focus/:id/toggle` | Toggle daily focus checklist item |
| `GET` | `/api/assessments/available` | List available skill assessments |
| `GET` | `/api/assessments/questions` | Fetch assessment quiz questions |
| `POST` | `/api/assessments/submit` | Submit answers, score test & dynamically update skill gap map |
| `GET` | `/api/conversations` | List persistent AI Mentor chat sessions (Today, Yesterday) |
| `GET` | `/api/conversations/:id` | Fetch chat history for session |
| `POST` | `/api/ai/chat` | Send message to AI Mentor & receive contextual reply |
| `GET` | `/api/recommendations` | Fetch personalized course recommendations |

---

## 🎨 Theme Synchronization

When switching between **Light** and **Dark** mode:
1. The DOM root class `.dark` updates immediately.
2. An API call `PUT /api/users/preferences` persists `{ theme: "dark" | "light" }` to PostgreSQL.
3. On subsequent logins or page refreshes, the user's saved theme is automatically retrieved and applied.
