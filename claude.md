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
- **Backend/DB:** Node/Express, Firebase (Firestore/Auth) — *Note: The current iteration is a pure frontend prototype with in-memory mock data simulating backend responses.*

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
- Connect Firebase Auth.
- Replace `mockData.js` with real Firestore listeners.
- Connect the Python NLP microservice for real-time sentiment analysis and moderation.
