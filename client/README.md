# InternLink — University Group Project

A web platform for verified internship discovery, student CV management, explainable skill-to-job recommendations, and application tracking.

## Stack
- Next.js 16 / React 19 / Tailwind CSS
- Express.js / MongoDB (Mongoose)
- JWT authentication and role restrictions

## Development setup
1. Install Node.js (supported by Next.js 16), npm and MongoDB Atlas or local MongoDB.
2. From the repository root run `npm install`.
3. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and a long random `JWT_SECRET`.
4. Copy `client/.env.example` to `client/.env.local` (default `BACKEND_URL=http://localhost:5000`).
5. Terminal A: `npm run dev --workspace=server`
6. Terminal B: `npm run dev --workspace=client`
7. Open http://localhost:3000. Backend health endpoint: http://localhost:5000/api/health

Never commit real secrets or .env files. Do not use the preview mode for authentication or submissions.

## Current implemented flows
- Student/employer registration and login (Express + MongoDB)
- Student CV versions: `GET/POST /api/cvs`, `PUT/DELETE /api/cvs/:id`
- Select primary CV to sync skills with student profile
- Verified-employer-only public job browsing and applications
- Deterministic skill score and matched/missing skill explanations via `GET /api/recommendations`
- Application submission and status listing `POST /api/applications`, `GET /api/applications/me`
- Admin employer verification routes already exist: `PATCH /api/companies/:id/status`

## Verification
- Backend unit tests: `npm test --workspace=server`
- Frontend lint: `npm run lint --workspace=client`
- Frontend build: `npm run build --workspace=client`
- Manual smoke tests: register student, create/choose CV, register employer and company,
  verify company as admin, publish job, view recommendation, submit application, update application status.
- These commands and MongoDB integration must be run in a configured development environment;
  do not assume a successful build or end-to-end run from reading the source alone.

## Proposal alignment and remaining work
The August 2026 proposal prioritizes a verified employer marketplace, student CV builder,
skill-based recommendations, application status tracking, and email match alerts.
The initial version now has CV persistence and explainable score calculation, but **not**
a trained ML model, automatic LinkedIn/CV file import, scheduled email alerts, or
a production-ready mail service. Employer onboarding/admin UI and all role policies
need a full manual security test, as do database configuration and deployment.

Feature development is kept on `feature/internlink-proposal-completion`.
Merge to `main` only after a team review, successful CI/build checks and end-to-end testing.
