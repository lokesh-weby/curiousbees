# Contributing to CuriousBees

First off, thank you for considering contributing to CuriousBees! We rely on a community of developers, designers, and researchers to keep this platform running smoothly and securely.

This document outlines the processes and conventions we follow.

---

## 1. Project Philosophy

- **Security First:** We handle sensitive academic data. Never expose API keys, and always validate input on the backend.
- **Simplicity over Cleverness:** Write code that the next developer can understand in 5 minutes.
- **Type Safety:** We use TypeScript strictly. Avoid `any` at all costs.

---

## 2. Folder Structure Rules

We use a Turborepo monorepo. Please place your code in the appropriate package.

- `apps/web/`: All Next.js frontend code.
- `apps/api/`: All NestJS backend code.
- `packages/types/`: If you create a new interface shared between frontend and backend, it goes here.
- `packages/ui/`: Reusable React components (buttons, modals).
- `packages/shared-utils/`: Helper functions (date formatting, API fetchers).

---

## 3. Branching Strategy

We follow a simplified Git Flow.

- `main`: The production-ready codebase. Deployments happen automatically from here.
- `develop`: The active development branch. All feature branches branch off from here.
- `feature/<ticket-name>`: For new features (e.g., `feature/workspace-chat`).
- `bugfix/<ticket-name>`: For bug fixes (e.g., `bugfix/login-crash`).
- `hotfix/<ticket-name>`: For critical production fixes branching directly from `main`.

---

## 4. Commit Convention

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This helps us auto-generate changelogs.

**Format:** `<type>(<scope>): <subject>`

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
- `feat(auth): implement supervisor approval workflow`
- `fix(web): resolve hydration error on dashboard`
- `docs: update setup instructions in README`

---

## 5. Code Style

We use Prettier and ESLint (configured in `packages/config`).

Before committing, ensure your code passes the linters:
```bash
npm run lint
npm run format
```

**TypeScript Guidelines:**
- Always define return types for functions.
- Use `interface` for object definitions over `type`.
- Prefer `async/await` over raw `.then()` chains.

---

## 6. Pull Request Process

1. **Branch:** Create a branch from `develop`.
2. **Code:** Write your feature or fix.
3. **Commit:** Use conventional commits.
4. **Push:** Push your branch to the remote repository.
5. **Open PR:** Open a Pull Request targeting the `develop` branch.
6. **Description:** Fill out the provided PR template. Explain *why* you made the change, not just *what* the change is.
7. **Review:** Request a review from at least one core maintainer.

---

## 7. Issue Reporting

If you find a bug, please create an issue using the Bug Report template. Include:
- A clear, descriptive title.
- Steps to reproduce the behavior.
- Expected vs. actual behavior.
- Environment details (OS, Browser, Node version).

---

## 8. Review Checklist

When reviewing a PR, consider:
- Does this code solve the problem outlined in the issue?
- Is the code typed correctly?
- Are there any security vulnerabilities?
- Is the UI responsive?
- Are new backend endpoints protected by the `FirebaseAuthGuard`?
- Has the Prisma schema changed? If so, is there an accompanying migration?

---

## 9. Developer Onboarding

If you are a new developer joining the project:
1. Read the [README.md](./README.md) for local setup instructions.
2. Read the [ARCHITECTURE.md](./ARCHITECTURE.md) to understand data flow.
3. Reach out to the repository admin to receive your local `.env` secrets.
4. Pick up a `good first issue` tagged ticket to get your feet wet!
