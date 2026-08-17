# MindSaathi — SIH 2025 Project Context

## Project Overview
MindSaathi is a digital mental health and psychological support system for students in higher education.
It combines a chatbot, a mood tracker, and a pseudonymous peer forum with a core differentiator: a **history-aware risk-triage engine**.

### Core Differentiators
1. **History-Aware Risk Triage:** AI decides urgency based on trend analysis (e.g., PHQ-9 / GAD-7 over time), not just snapshot conversations.
2. **Institution-Level Early Warning Analytics:** Aggregated, identity-blind trends for administrators to act proactively.
3. **Dual Trust Model:** 
   - Real email linked for private clinical tracking & triage.
   - Pseudonymous identity for the peer forum.
4. **Trojan Horse UI:** Premium, modern dark-mode aesthetic. Less clinical, more lifestyle/productivity-focused to drive adoption.
5. **Stealth SOS Button:** Immediate, discrete escalation bypasses AI straight to Tele-MANAS, iCall, or assigned counsellors.

## Tech Stack
- **Frontend:** React (Vite), JavaScript (.jsx)
- **Styling:** Tailwind CSS v3, Custom CSS (dark-theme, gradients)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Backend/DB:** Node/Express, Firebase (Firestore/Auth), Gemini API (Chatbot & Moderation) — *Note: Actively implementing the backend service.*

## Current Prototype State
All key screens and flows for the frontend prototype are implemented:

- `/` (Landing): Login screen with role switching (Student/Admin).
- `/onboarding`: 3-step privacy and onboarding explanation.
- `/dashboard`: Student overview, streak, recent risk trends (chart), quick actions.
- `/checkin`: Clinical check-in using PHQ-9 and GAD-7, capturing immediate risk (e.g. Q9 override).
- `/journal`: Mood and text-based journaling.
- `/chat`: NLP-simulated AI chatbot that escalates based on distressed keywords.
- `/forum`: Pseudonymous peer forum with simulated NLP moderation (flagging/approval).
- `/resources`: Actionable coping mechanisms and helplines.
- `/profile`: User settings and mock data preferences.
- `/admin` (Dashboard): Institution-wide analytics and distribution using Recharts.
- `/admin/alerts`: Active escalation list mapping real student identities (counsellor view).

## Future Integrations (Backend Phase)

### 1. Developer Work-Split
To allow parallel development and avoid code conflicts, the backend architecture is split into clean modules:

- **Person A (User) — Core APIs & Admin Console:**
  - Setup core Express server (`server.js`), folder structure, and database connection.
  - Implement Firebase Auth validation middleware (`authMiddleware.js`).
  - Develop User Profile APIs (`userRoutes.js`, `userController.js`).
  - Develop Clinical Check-in APIs (`checkinRoutes.js`, `checkinController.js`) implementing the PHQ-9 & GAD-7 risk engine.
  - Develop Journal APIs (`journalRoutes.js`, `journalController.js`).
  - Develop Admin Analytics and Escalation alerts API (`adminRoutes.js`, `adminController.js`).

- **Person B (Teammate) — AI Chatbot, Forum & Moderation Services:**
  - Develop Pseudonymous Peer Forum APIs (`forumRoutes.js`, `forumController.js`).
  - Integrate AI Chatbot endpoints (`chatRoutes.js`, `chatController.js`).
  - Build `aiService.js` using the Gemini API for natural language conversational therapy & automated risk analysis.
  - Build `moderationService.js` to automatically filter, approve, or flag forum posts for distress/toxicity before publication.

### 2. AI Model Integration Details
- **Chatbot:** Utilizes Gemini (via `@google/generative-ai` SDK) to simulate empathetic mental health conversations. It parses chat logs in real-time, calculates sentiment, and flags immediate distress triggers (e.g. self-harm concepts) to trigger risk-triage overrides.
- **Forum Monitor:** Submissions to the Peer Forum are automatically analyzed by Gemini before being approved. If the AI detects abusive content or severe self-harm ideation, the post is automatically quarantined (moderationStatus set to `flagged`) and an escalation alert is immediately generated for the college counsellors to view on the Admin Alerts panel.
