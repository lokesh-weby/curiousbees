<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success.svg?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
</div>

<br />

<h1 align="center">CuriousBees V2</h1>
<h3 align="center">Research Collaboration Platform for Universities</h3>

<p align="center">
  A centralized ecosystem that connects Research Scholars, Faculty Supervisors, and Institutional Administrators to foster seamless academic collaboration.
</p>

---

## 🌟 Project Vision

CuriousBees V2 exists to modernize university research ecosystems. By eliminating scattered emails and disparate tools, CuriousBees provides a unified environment where scholars can find collaboration opportunities, share workspaces, track research milestones, and engage in real-time academic discussions.

## 👥 Who Uses CuriousBees?

### Research Scholars
Students and researchers looking for faculty supervision, seeking cross-departmental collaboration, or wanting to track their research progress within dedicated workspaces.

### Research Supervisors
Faculty members and guides who manage multiple scholars, approve research requests, oversee academic milestones, and discover emerging talent within the institution.

### Institutional Admins
University officials and department heads requiring top-level oversight of research activities, user governance, and platform management.

---

## ✨ Feature Overview

- **Secure Authentication & Roles:** Enterprise-grade SSO via Firebase, strictly protected by Next.js edge-middleware.
- **Supervisor Approval Workflow:** A mandatory onboarding flow requiring scholars to request and receive formal faculty approval before unlocking platform capabilities.
- **Dedicated Workspaces:** Isolated digital rooms for approved teams to share files, post announcements, and track milestones.
- **Opportunities Board:** A centralized hub for posting and responding to collaboration requests, hiring needs, or research grants.
- **Discussion Forums (Threads):** Real-time, topic-based discussions enabling researchers to share findings and seek advice.
- **Background Notifications:** Asynchronous push notifications powered by BullMQ, Redis, and Firebase Cloud Messaging (FCM).

---

## 🏗️ Architecture Overview

CuriousBees utilizes a modern decoupled monorepo architecture:
- **Client Interface:** A highly interactive React application powered by Next.js (App Router), styled with Tailwind CSS, and managed by Zustand.
- **API Gateway:** A strictly typed NestJS backend that handles business logic, authorization guards, and database transactions.
- **Data Layer:** PostgreSQL database managed by Prisma ORM and hosted on Supabase, ensuring high availability.
- **Background Jobs:** Redis-backed BullMQ processing asynchronous tasks such as push notifications.

For an in-depth technical breakdown, see [ARCHITECTURE.md](./ARCHITECTURE.md).

---

## 🛠️ Technology Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | Next.js (React), Tailwind CSS, Zustand, React Query |
| **Backend** | NestJS, Prisma ORM, BullMQ |
| **Database** | PostgreSQL (via Supabase), Redis |
| **Authentication** | Firebase Auth (Google SSO), Next.js Middleware |
| **Infrastructure** | Vercel (Frontend), Render/Docker (Backend) |

---

## 📂 Project Structure

CuriousBees uses a Turborepo-driven monorepo structure to share code efficiently between the frontend and backend.

```text
curiousbees-monorepo/
├── apps/
│   ├── web/                # Next.js Frontend Application
│   └── api/                # NestJS Backend API
├── packages/
│   ├── types/              # Shared TypeScript definitions
│   ├── shared-utils/       # Shared utility functions (e.g. apiFetch)
│   ├── ui/                 # Shared React/Tailwind UI components
│   ├── constants/          # Shared system constants
│   └── config/             # Shared ESLint/Prettier configurations
├── docs/                   # Internal documentation and assets
└── scripts/                # CI/CD and automation scripts
```

---

## 🔐 Authentication Flow

CuriousBees uses a hybrid, secure authentication mechanism:
1. **Client Auth:** The user clicks "Continue with Google" and authenticates against Firebase.
2. **Token Exchange:** The frontend sends the Firebase JWT to the NestJS backend (`/api/auth/me`).
3. **Backend Validation:** NestJS verifies the token using the Firebase Admin SDK and syncs the user with the PostgreSQL database.
4. **Role Assignment:** The backend returns the user's assigned role (defaulting to `RESEARCH_SCHOLAR`).
5. **Edge Protection:** The frontend sets a secure `cb-role` cookie, which Next.js middleware uses to protect portal routes.

---

## 🖥️ Dashboard Overview

The platform uses a dynamically rendering unified dashboard (`/dashboard`):

- **Scholar Dashboard:** Focuses on research telemetry (H-Index, publications), upcoming deadlines, trending research clusters, and live discussion feeds.
- **Supervisor Dashboard:** Focuses on academic management, displaying approval queues, collaboration requests, and performance metrics for active scholars.
- **Admin Dashboard:** Located at `/dashboard/admin`, providing institutional oversight and global user management.

---

## 💻 Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Local or Supabase)
- Redis Server (Local or Docker)
- Firebase Project configured for Web Auth and Admin SDK

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env` at the root of the project. You must populate the following sections:
- `DATABASE_URL` / `DIRECT_URL` (PostgreSQL connection strings)
- `NEXT_PUBLIC_FIREBASE_*` (Firebase Client configs)
- `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` (Firebase Admin configs)
- `REDIS_HOST` / `REDIS_PORT` (Redis connection strings)

### 3. Database Migration
Push the Prisma schema to your database and generate the client:
```bash
npm run db:migrate
npm run db:generate
```
*(Optional) Seed the database with mock data:*
```bash
npm run db:seed
```

### 4. Run Development Servers
Start both the frontend (Port 3000) and backend (Port 4000) concurrently:
```bash
npm run dev
```

---

## 🚀 Build & Deployment Instructions

**Frontend (Vercel):**
1. Connect your repository to Vercel.
2. Ensure the Root Directory is set to `apps/web`.
3. Configure the environment variables.
4. Vercel automatically runs `next build`.

**Backend (Docker / Render):**
1. The API can be containerized using the provided Dockerfile.
2. Build the image: `docker compose up -d --build`.
3. In a production environment (like Render), set the start command to:
   ```bash
   npm run prisma:generate && node dist/apps/api/src/main.js
   ```

---

## 🤝 Contributing Guidelines

We welcome contributions to CuriousBees! Whether you're fixing a bug, improving the UI, or adding new collaboration features, please read our [CONTRIBUTING.md](./CONTRIBUTING.md) guide before submitting a Pull Request.

---

## 🗺️ Roadmap

- **Phase 1 (Completed):** Core Collaboration (Workspaces, Threads, Opportunities)
- **Phase 2 (Upcoming):** Mobile Native Application (React Native)
- **Phase 3 (Planned):** SSO Integration directly with University Active Directory (e.g., specific `@srmist.edu.in` domain mapping).

---

## 📄 License

CuriousBees is proprietary software developed for internal university usage. Unauthorized copying, distribution, or modification is strictly prohibited.
