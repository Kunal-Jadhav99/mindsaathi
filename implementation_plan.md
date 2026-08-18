# MindSaathi Backend Implementation Plan

Introduce a fully functional Node.js/Express backend for MindSaathi, replacing the local mock data simulation. This backend will:
1. Connect with **Firebase Authentication** and **Firestore** for secure database operations.
2. Expose REST endpoints for clinical check-ins, journal entries, and institution-wide admin dashboards.
3. Integrate the **Groq API** (`openai/gpt-oss-120b`) for an empathetic chatbot and automated sentiment-based forum post moderation.
4. Establish a modular codebase structure to allow two developers (Person A and Person B) to work concurrently without merge conflicts.

---

## Developer Work-Split
To prevent file-level git conflicts, we will structure the `backend/` folder into modules:

### Person A (User) — Core APIs & Database Connections
- **Project Setup & Base entry:** Initialize backend structure, `package.json`, and database configuration (`backend/config/firebase.js`).
- **Auth verification middleware:** Create `backend/middlewares/authMiddleware.js` to validate Firebase client ID tokens.
- **User Profile API:** Endpoints in `userRoutes.js` and `userController.js` to manage pseudonym selection and onboarding state.
- **Clinical Check-ins API:** Endpoints in `checkinRoutes.js` and `checkinController.js` implementing the GAD-7 & PHQ-9 scoring + trend calculation.
- **Journals API:** Endpoints in `journalRoutes.js` and `journalController.js` to save and load student diary/mood checkins.
- **Admin analytics and alerts:** Endpoints in `adminRoutes.js` and `adminController.js` providing clinical risk statistics and alert lists for high-risk triage.

### Person B (Teammate) — AI & Forum Services
- **Pseudonymous Peer Forum API:** Endpoints in `forumRoutes.js` and `forumController.js` handling creation, listing, liking, commenting, and filtering.
- **AI Chatbot Endpoint:** Dialog management and history endpoints in `chatRoutes.js` and `chatController.js`.
- **Groq service wrapper:** Asynchronous interface in `backend/services/aiService.js` handling prompts, model settings, and response generation.
- **Automatic moderation service:** Automated toxicity and risk classification in `backend/services/moderationService.js` to screen posts for self-harm concepts.

---

## Configuration & Credentials (Local Setup)

Please make sure the following files are added locally and kept secure (already added to `.gitignore`):
1. **`.env` file in `backend/`:**
   ```env
   PORT=5000
   GROQ_API_KEY=your_groq_api_key_here
   FIREBASE_PROJECT_ID=your_firebase_project_id_here
   ```
2. **Firebase Account JSON in `backend/config/firebase-service-account.json`:**
   Obtain this from Firebase Console -> Project Settings -> Service Accounts -> Generate New Private Key.

---

## Backend Directory Tree
```
backend/
├── .env
├── .env.example
├── server.js
├── package.json
├── config/
│   ├── firebase.js
│   └── firebase-service-account.json (gitignored)
├── middlewares/
│   └── authMiddleware.js
├── routes/
│   ├── userRoutes.js
│   ├── checkinRoutes.js
│   ├── journalRoutes.js
│   ├── adminRoutes.js
│   ├── forumRoutes.js
│   └── chatRoutes.js
├── controllers/
│   ├── userController.js
│   ├── checkinController.js
│   ├── journalController.js
│   ├── adminController.js
│   ├── forumController.js
│   └── chatController.js
└── services/
    ├── aiService.js
    └── moderationService.js
```

---

## Verification Plan

### Automated Tests
- Construct local HTTP test scripts in `backend/tests/api.test.http` to test controllers.
- Write a validation script `backend/scripts/testGroq.js` to assert Groq model connectivity.

### Manual Verification
- Deploy server locally on port `5000` via `npm run dev`.
- Query endpoints with `curl` or VS Code REST Client.
- Verify risk triage by submitting high-risk PHQ-9 overrides to ensure admin alerts get triggered in Firestore.
