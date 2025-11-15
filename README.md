# 🧠 Origin Take-Home Assignment — Therapist Session Dashboard
**Stack:** TypeScript · Next.js 13+ (App Router) · REST API · Postgres (Neon) · TailwindCSS  

---

## ✉️ Overview
Welcome 👋 — and thanks for taking the time to complete Origin Therapy’s take-home challenge.  
This exercise mirrors real full-stack work at **Origin**: connecting clean backend APIs to polished, type-safe UIs.

You’ll build a small **Therapist Session Dashboard** using **Next.js**, **TypeScript**, and a provided **Neon Postgres** database.

This assignment is scoped for about **3–5 hours** of work for someone comfortable with these tools.  
Feel free to use **AI coding assistants** (Cursor, Copilot, Claude, etc.) — we care most about structure, clarity, and UX judgment.

---

## 🎯 Goal
Build a small **full-stack web app** where therapists can view and update their upcoming sessions.

You’ll:
1. Connect to a provided **Postgres database** (already seeded with mock data).  
2. Build a small **REST API** that reads and updates data.  
3. Create a **Next.js UI** that consumes that API and presents a usable dashboard.  

---

## 🧱 Database Access
You’ll receive your personal **Neon connection string** by email.

Add it to a local `.env.local` file:
```bash
DATABASE_URL="postgresql://takehome_user:password@ep-example.neon.tech/neon?branch=takehome-yourname&sslmode=require"
```

This connects to your own isolated branch seeded with mock data for:
- Therapists  
- Patients  
- Sessions  

You can safely modify session data (read/write only — no schema changes).

---

## 🧩 Requirements

### 1️⃣ Backend (REST API)
- Connect to the provided **Postgres** database.  
- Implement at least two endpoints:
  - `GET /api/sessions` → returns all sessions (joined with therapist + patient names)
  - `PATCH /api/sessions/:id` → updates a session’s `status` (e.g. “Completed”)
- Use **TypeScript** throughout.  
- Handle validation and errors gracefully (`400 / 404 / 500`).  
- Use either **pg**, **Drizzle**, or **Prisma** for DB access.

---

### 2️⃣ Frontend (UI)
- Display sessions in a responsive table or card layout.  
- Show therapist name, patient name, date/time, and status.  
- Add a **“Mark Completed”** button calling your PATCH endpoint.  
- Include **loading**, **error**, and **empty** states.  
- Style with **TailwindCSS** — clean and readable is perfect.

---

### 3️⃣ Bonus (optional)
- Add search / filter (e.g. by therapist or status).  
- Add optimistic UI updates (update the UI immediately on click).  
- Deploy to [Vercel](https://vercel.com) or [Render](https://render.com).  

---

## 🧰 Setup

### 1. Clone / Install
```bash
git clone https://github.com/Origin-Therapy/origin-takehome-interview.git
cd origin-takehome-interview
npm install
```

### 2. Environment Variables
Create a `.env.local` file:
```bash
DATABASE_URL="your-connection-string"
```

### 3. Run Locally
```bash
npm run dev
# open http://localhost:3000
```

---

## 🧾 Submission
When finished, please send:
1. A link to your **GitHub repo** (public or invite us).  
2. A short section in your README titled **“Design Choices”** explaining:  
   - How you approached the problem  
   - Any trade-offs or assumptions  
   - What you’d improve with more time  
3. *(Optional)* A 2–3 minute Loom or screen recording showing your app.

Email your submission to **ni@joinoriginspeech.com**.

---

## Design Choices

### How I Approached the Problem
1. First of all, I thought it would be best to use the current Origin Speech color palette to show coherence between the website and the dashboard. So, I added the Origin Speech icon and used brand colors.
2. Instead of a plain dashboard, I made it a dedicated page with a clear header and branding, so users know what it’s about before seeing the sessions.
3. The design is fully desktop and mobile responsive for accessibility and usability.
4. Adding a child image was a good final touch to boost the design and make it feel more friendly and relevant to the company mission.

- **Database Layer**: Used Prisma ORM for type-safe database operations with Neon PostgreSQL
- **API Layer**: Built RESTful endpoints following Next.js 13+ App Router conventions with proper error handling
- **Frontend**: Created a responsive table-based dashboard with real-time data fetching and optimistic updates
- **Styling**: Used TailwindCSS for consistent, mobile-first design with clean gray/green/blue color scheme
- **Search & Filter**: Added client-side filtering for therapist/patient names and session status

### Trade-offs and Assumptions
- **Prisma vs Raw SQL**: Chose Prisma for type safety and faster development, though it adds some overhead
- **Client-side State**: Used React useState instead of a state management library since the app scope is small
- **Table vs Cards**: Chose table layout for better data density and sorting capabilities
- **Authentication**: Assumed no authentication needed for this demo (would be required in production)

### What I'd Improve with More Time
- **Enhanced UX**: Add loading skeletons, toast notifications, and confirmation dialogs for actions
- **Data Validation**: Implement schema validation with Zod for both frontend and backend
- **Testing**: Add unit tests (Jest) and integration tests (Playwright)
- **Accessibility**: Add proper ARIA labels, keyboard navigation, and screen reader support
- **Advanced Filters**: Date range picker, therapist specialty filter, and saved filter presets



## 🗓 Timeline
Please submit within **24 hours** of receiving your database URL.  
Need more time? No problem — just ask.

---

## 🧮 Evaluation Rubric (25 pts)

| Category | Points | What We Look For |
|-----------|--------|-----------------|
| Backend Correctness | 5 | Endpoints work; updates persist |
| Type Safety / Data Modeling | 5 | Clean TypeScript; no `any` |
| Frontend Implementation | 5 | Functional UI fetching real data |
| UX & Visual Polish | 4 | Clear loading/error states |
| Code Structure & Clarity | 4 | Logical, modular organization |
| Documentation / Reasoning | 2 | README clarity and setup instructions |

✅ *Bonus (+3 pts)* for optimistic UI, caching, or elegant UX touches.

---

## 🧱 Database Schema (for reference)

```sql
CREATE TABLE therapists (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT
);

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  therapist_id INT REFERENCES therapists(id),
  patient_id INT REFERENCES patients(id),
  date TIMESTAMP NOT NULL,
  status TEXT CHECK (status IN ('Scheduled','Completed')) DEFAULT 'Scheduled'
);
```

**Example Row**

| Therapist | Patient | Date | Status |
|------------|----------|------|--------|
| Anna SLP | Ariel Underwood | 2025-11-08 09:00 | Scheduled |

---

## 💬 Questions
If anything’s unclear or your DB connection fails, email **ni@joinoriginspeech.com** — we’ll help quickly.

---

## 📘 Helpful Links
- [Next.js App Router Docs](https://nextjs.org/docs/app)  
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)  
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)  
- [TailwindCSS Docs](https://tailwindcss.com/docs)  
- [Neon Postgres](https://neon.tech/docs/introduction)

---

**Good luck — and have fun building!**  
We’re excited to see how you approach full-stack problems thoughtfully and pragmatically.  

—  
**Ni & the Origin Team**  
[joinoriginspeech.com](https://joinoriginspeech.com)

---

## ⚠️ Notice
This repository is for Origin Therapy’s engineering take-home assignment.  
It’s provided publicly so candidates can easily access the instructions.  
Please do not submit pull requests or use this repository for other purposes.
