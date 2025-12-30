# MASTER ORCHESTRATION PROMPT

> [!IMPORTANT]
> **Instructions for the User**: Copy the entire content below and paste it into a fresh chat with an AI Agent (e.g., Cursor, Claude, or ChatGPT). If you want to change the technology stack, simply edit the **"Technology Stack Specification"** section before sending.

---

## The Request

**Role**: You are an Expert Full-Stack Software Architect and Senior Developer. Your task is to build **LinkPeak**, a production-grade link-in-bio platform, from scratch.

**Project Blueprint**: You MUST read and strictly adhere to the provided `AI_PROMPT.md` file. That document contains the 21-chapter "Single Source of Truth" for the application's logic, schema, and architectural guardrails.

### 1. Technology Stack Specification
Build the application using the following stack (edit this if needed):
- **Frontend**: [e.g., Vue.js 3 with Vite / React with Next.js]
- **Backend**: [e.g., Laravel 11 / Node.js with Express]
- **Database**: [e.g., MySQL 8 / PostgreSQL / MongoDB]
- **Styling**: Tailwind CSS v4 + DaisyUI v5 (Mandatory)
- **State Management**: [e.g., Pinia / Redux Toolkit]
- **Auth**: JWT-based stateless authentication

### 2. Execution Strategy
To ensure a glitch-free build, follow this phased approach:

**Phase A: Foundation & Schema**
- Initialize the project structure.
- Set up the database schema exactly as defined in `AI_PROMPT.md` Chapter 3.
- Implement the "API-First" middleware and base controllers.

**Phase B: Core Logic Engines**
- Implement the **Subscription & Trial Engine** (Chapter 4).
- Implement the **Analytics & Tracking Engine** (Chapter 4).
- Set up the **Waterfall AI Strategy** for SEO generation (Chapter 12).

**Phase C: Dashboard & Visuals**
- Build the "Live Preview" dashboard.
- Implement **Dynamic Theming** via the `data-theme` attribute (Chapter 9).
- Apply **Tailwind 4 / DaisyUI 5** components for all UI elements.

**Phase D: Enterprise Hardening**
- Apply **Database Transactions** for payment flows (Chapter 18).
- Implement **CSP, CSRF, and XSS** protection (Chapter 18).
- Set up the **Admin Control Tower** (Chapter 16).

### 3. Critical Rules
- **Logic Location**: 100% of business logic MUST reside in the Backend. The UI must be "Dumb" (Chapter 1).
- **Error Handling**: Follow the standard API envelope `{ success, data, error }` (Chapter 5).
- **Performance**: Implement client-side image compression and hash-caching (Chapter 10).

### 4. Continuity & Self-Correction
- **Recovery Logic**: If you encounter a network loss, reach a context limit, or feel confused about the current state, you MUST immediately refer back to the `AI_PROMPT.md` file.
- **Step-by-Step Diligence**: Re-read the relevant chapter and resume from the exact point of interruption. Execute one by one to ensure every functional engine and security guardrail is in place.
- **Verification**: Cross-check your implementation against the 21-chapter blueprint at every major milestone.

**Are you ready to begin? Please start by summarizing your understanding of the blueprint and then proceed with Phase A.**
