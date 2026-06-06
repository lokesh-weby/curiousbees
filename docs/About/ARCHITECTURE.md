# CuriousBees Architecture

This document provides a comprehensive technical overview of the CuriousBees V2 platform, a modern, decoupled monorepo designed for scale, security, and real-time research collaboration.

---

## 1. System Architecture

CuriousBees utilizes a strictly typed, client-server architecture. The frontend handles presentation and edge-level security, while the backend orchestrates business logic, database transactions, and background jobs.

```text
       [ User Browser ]
              |
      (HTTPS / Bearer JWT)
              |
    [ Vercel Edge Network ] --- (Next.js Middleware validates Role Cookie)
              |
     [ Next.js React App ] ---> [ External Clients: Firebase Auth ]
              |
      (REST API Fetching)
              |
+-----------------------------+
|    CuriousBees Gateway      |
|  (NestJS / Render / Docker) |
+-----------------------------+
    |                  |
(Prisma ORM)       (BullMQ)
    |                  |
 [ Supabase ]      [ Redis ]
 (PostgreSQL)      (Message Queue)
```

---

## 2. Frontend Architecture

**Technology:** Next.js 14+ (App Router), React, Tailwind CSS, Zustand, React Query.

- **Routing:** Handled entirely by the Next.js App Router (`apps/web/src/app`). Protected portal routes reside within the `(portal)` route group.
- **State Management:** 
  - Global UI state and entity caching are managed by `Zustand` (`apps/web/src/store/useStore.ts`).
  - Strict unidirectional data flow ensures components re-render predictably.
- **Styling:** Tailwind CSS combined with `lucide-react` for iconography. A robust design token system ensures consistent theming.
- **API Client:** A custom abstraction (`apiFetch`) automatically intercepts outgoing requests to attach the active Firebase Authorization header, ensuring secure communication with the backend.

---

## 3. Backend Architecture

**Technology:** NestJS 10+, TypeScript, RxJS, class-validator.

- **Modularity:** The backend is divided into discrete feature modules (e.g., `UsersModule`, `ThreadsModule`, `WorkspacesModule`). This ensures strong encapsulation.
- **Dependency Injection:** Services are injected into Controllers, adhering to SOLID principles.
- **Guards & Interceptors:** 
  - `FirebaseAuthGuard` protects all endpoints by validating the incoming Bearer JWT against the Firebase Admin SDK.
  - Exception filters catch and format errors into a standardized JSON response structure.
- **Validation:** Incoming payloads are strictly validated using DTOs (Data Transfer Objects) combined with `class-validator` and `class-transformer`.

---

## 4. Database Architecture

**Technology:** PostgreSQL (hosted on Supabase), Prisma ORM.

The schema is heavily relational, enforcing strict referential integrity.
- **Core Entities:** `User`, `Thread`, `Comment`, `Opportunity`, `Event`, `Workspace`.
- **Cascading Deletes:** Removing a parent entity (e.g., a `Thread` or `Workspace`) automatically cleans up related child entities (e.g., `Comments` or `WorkspaceFiles`).
- **Enums:** Strongly typed enums for Roles (`UserRole`) and statuses (`EventStatus`, `OpportunityStatus`).

---

## 5. Authentication Architecture

We utilize a robust hybrid authentication model that offloads credential management to Google/Firebase while maintaining absolute authority over roles in our backend database.

### Authentication Flow

```text
User           Next.js Frontend         Firebase Auth        NestJS Backend         PostgreSQL
 |                    |                       |                    |                    |
 |--- Clicks Login -->|                       |                    |                    |
 |                    |--- Request OAuth ---->|                    |                    |
 |                    |<-- Returns ID Token --|                    |                    |
 |                    |                       |                    |                    |
 |                    |-- POST /api/auth/me (Bearer Token) ------->|                    |
 |                    |                       |                    |--- Verify Token -->|
 |                    |                       |                    |<-- User Details ---|
 |                    |<-- 200 OK (User Profile & Role) -----------|                    |
 |                    |                       |                    |                    |
 |<-- Set `cb-role` --|                       |                    |                    |
 |    cookie &        |                       |                    |                    |
 |    redirect to     |                       |                    |                    |
 |    /dashboard      |                       |                    |                    |
```

---

## 6. Role-Based Access Control (RBAC)

Access control operates on two layers:

1. **Edge Layer (Next.js Middleware):** 
   - Reads the `cb-role` cookie.
   - Checks `permissions.ts` to see if the assigned role is authorized for the requested pathname.
   - Redirects unauthorized users to `/auth/unauthorized` before the page even renders.

2. **API Layer (NestJS Guards):**
   - Endpoints are protected by `@UseGuards(FirebaseAuthGuard)`.
   - specific mutations can be further restricted by Role Guards (e.g., only `INSTITUTION_ADMIN` can delete a user).

---

## 7. Supervisor Approval Workflow

To maintain academic integrity, new users cannot immediately access the platform.

1. **Onboarding:** A new user authenticates via Google. Their profile is created in Postgres with `approved: false`.
2. **Request:** The scholar selects a supervisor from a dropdown list and submits a request.
3. **Notification:** A background job triggers an FCM push notification to the targeted supervisor.
4. **Action:** The supervisor sees the request in their dashboard (`/dashboard`) and clicks "Approve".
5. **Fulfillment:** The backend updates the scholar to `approved: true`, granting them access to the portal routes.

---

## 8. Workspace Architecture

Workspaces are isolated collaborative environments.
- **Membership:** Users are explicitly added to a workspace via the `WorkspaceMember` join table.
- **Resources:** 
  - **Files:** Managed via `WorkspaceFile` records (pointing to external storage URLs).
  - **Milestones:** Trackable deadlines via `WorkspaceMilestone`.
  - **Announcements:** Broadcast messages via `WorkspaceAnnouncement`.
- **Security:** Backend controllers ensure that a user requesting workspace data actually possesses a valid `WorkspaceMember` record for that specific workspace.

---

## 9. Opportunity Management

The Opportunities module facilitates research recruitment.
- Users can create an `Opportunity` (e.g., looking for a co-author).
- Other users can submit a `CollaborationRequest` linking to that opportunity.
- The opportunity owner can transition these requests between `PENDING`, `PUBLISHED` (Accepted), or `REJECTED`.

---

## 10. Notifications System

We employ an asynchronous, queue-based notification system to prevent blocking the main API thread during heavy I/O operations (like communicating with Firebase Cloud Messaging).

1. An action occurs (e.g., a new comment is posted).
2. The `NotificationsService` drops a payload into a BullMQ queue backed by Redis.
3. The API responds to the user immediately.
4. A background `NotificationProcessor` consumes the job, looks up the recipient's FCM tokens in Postgres, and dispatches the push notification via the Firebase Admin SDK.

---

## 11. Deployment Architecture

- **Frontend:** Deployed on Vercel. Vercel automatically handles static generation, edge middleware deployment, and global CDN distribution.
- **Backend:** Containerized via Docker. Deployed on platforms like Render, Railway, or AWS ECS. It requires persistent connections to the Redis instance and the Supabase PostgreSQL database.
- **Database:** Supabase provides a managed, scalable PostgreSQL instance with built-in connection pooling (PgBouncer) for handling spikes in traffic.

---

## 12. Future Scalability Considerations

- **Read Replicas:** As the user base grows, Supabase read replicas can be introduced. NestJS Prisma clients can be configured to route read-heavy operations (like loading the Thread feed) to the replicas.
- **Microservices:** If the Notifications queue becomes a bottleneck, the `NotificationProcessor` can be extracted into a standalone worker node, separate from the main API gateway.
- **Storage Strategy:** Currently, file URLs are stored in the database. In the future, a direct integration with Supabase Storage or AWS S3 utilizing presigned URLs will be necessary for secure, large-scale document management.
