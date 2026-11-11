# InternLink — Viva demonstration and release checklist

**Code target:** `feature/internlink-proposal-completion` (the GitHub `main` branch is deliberately not modified).  
**Hosting:** Vercel frontend + Render **Free** backend + MongoDB Atlas Free. No paid Render upgrades/add-ons.

## Original proposal alignment (August 2026)

InternLink is a two-sided platform for university students and verified employers. The core value is a structured CV and skill-to-internship recommendation feed, with applications and their statuses visible to students. This is an academic demo, not a public hiring service.

| Proposal requirement | Implementation and validation |
| --- | --- |
| Student and employer registration/login | MongoDB-backed authentication and role-specific dashboard routing; cookie-based session |
| In-app CV builder | Structured skills, education, experience, projects, multiple versions; stored in MongoDB |
| Employer verification | Employer registers company as Pending; admin explicitly verifies before public listings |
| Job browsing/search/posting | Verified active, non-expired jobs returned by Express API; employers must own verified company |
| Matching and recommendations | Deterministic, explainable skills-overlap score with relevant location/category preferences; **not a trained AI model** |
| Application status | Real records with student and employer workflow; statuses update after employer action (not WebSocket push) |
| Alerts | In-app application updates; **scheduled email match alerts are not yet configured** |
| Import existing CV / LinkedIn | **Not yet implemented**; structured CV can be entered manually |
| Applicant ranking/pipeline dashboard | Original proposal explicitly lists the full employer ranking pipeline as out-of-scope |

**Do not claim that email match alerts, PDF/LinkedIn import or a trained AI model are operational** during the viva. Explain the implemented matching algorithm transparently.

## Critical live-demo prerequisites

1. On the Vercel project, Production Branch must be `feature/internlink-proposal-completion` and `BACKEND_URL` must point to the correct Render service. Confirm production deployment is READY.
2. On Render, retain the **Free** instance type, ensure `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` are configured. Never paste credentials into GitHub, ChatGPT or screenshots.
3. MongoDB Atlas IP access must allow only Render outbound ranges; the previously verified Singapore service ranges are `74.220.52.0/24` and `74.220.60.0/24`. Recheck Render if it migrates regions/services.
4. Check `https://team-vertex-intern-link.vercel.app/api/health` → HTTP 200 and `database: "connected"`. Check `/api/jobs` → HTTP 200.
5. **Set up three dedicated demo identities** before the viva: an admin, a student, and an employer. Do not use teammates' existing accounts without consent. Assign strong unique passwords privately and do not commit them to source.
6. Register an employer → register a clearly labeled **DEMO** company → verify as admin → post a clearly labeled **DEMO** internship. Fictional listings must be explicitly marked as practice/demo, not real openings.
7. With the student identity: edit profile skills, create a primary CV, refresh Recommendations and inspect the skill match percentage and rationale, apply to the demo internship, and check My Applications.
8. With the employer identity: view applicants for the new demo job, update one application to Under review / Interview scheduled / Accepted.
9. With the student identity: refresh Applications and Notifications; confirm new status appears.
10. With admin identity: verify metrics, company verification and internship reports. Show roles are enforced: student should not be able to use admin APIs.

## First administrator provisioning — guarded CLI, no web endpoint

The project deliberately prevents users from selecting `admin` at public registration. To bootstrap the **first** admin only, there is a guarded `server/scripts/bootstrap-admin.js` CLI script.

- Register a **dedicated, approved** admin account using the normal website, initially as a student.
- Run locally with `MONGO_URI` (the exact database Render uses), `ADMIN_EMAIL` for that registered account, `ADMIN_DATABASE` for the verified database name, and `ADMIN_BOOTSTRAP_CONFIRM=CREATE_FIRST_ADMIN` in the environment.
- From the `server/` folder run `node scripts/bootstrap-admin.js`. The script refuses to run if any admin exists, if the database name does not match, or if the target account does not exist. It revokes the account's prior sessions by incrementing its sessionVersion.
- Remove these temporary bootstrap variables after use. Never expose this script via an HTTP route or let Render run it automatically.

**Database warning:** Atlas currently contains databases named `test` and `internlink`. Determine which database Render uses from its `MONGO_URI` path before any admin promotion or data migration. Changing the database name without migrating data will make existing accounts and CVs appear missing. Do not copy or delete production data blindly.

## Demo acceptance matrix

| Test | Expected result |
| --- | --- |
| Guest open `/`, `/home` and `/job-details` | Pages load, list verified jobs only |
| Guest `GET /api/health` | HTTP 200; connected database |
| Guest `GET /api/jobs` | HTTP 200; excludes Pending/unverified/expired jobs |
| Student register/login/logout | Validated password, secure cookie, logout clears session |
| Wrong password / missing login | 401, no token leaked in JSON |
| Student CV create/update/primary | Own records persist, skills influence recommendation score |
| Student apply twice | First succeeds, duplicate rejected with 409 |
| Employer without verified company posts | Rejected (403) |
| Admin verifies employer company | Status changes Pending → Verified |
| Verified employer posts internship | Appears in public Jobs and student Recommendations |
| Employer sees other employer's applicants | Rejected (403) |
| Employer changes own applicant status | Student sees updated record |
| Guest / student loads admin page/API | Cannot see admin-only information |
| Cover letter | Uses user's actual values; editable and save/print-as-PDF |
| Forgot password without SMTP | Honest unavailable message; no pretend reset email |
| Mobile viewport | Navigation, forms, card layouts usable and no horizontal overflow |

## Operational notes

- Render free instances may cold-start after inactivity. Before the viva, load `/api/health` and confirm it reaches 200. Do not try to circumvent free-tier limits with paid upgrades.
- Use network access during demo; keep screen recordings/screenshots as fallback if the hosting provider is unavailable.
- Never use real students' personal information in screenshots, seed data or viva slides.
- Check Vercel deployments/Build Logs and Runtime Errors. A successful build alone does **not** prove the complete login-to-application workflow works.
- Run local automated unit test: `npm test --workspace=server`. Legacy integration scripts should be run in a controlled test database, not blindly against production.
- Final signoff requires manually completing the multi-role scenario and responsive browser review. An empty jobs/companies database is **not** a fully demo-ready state.
