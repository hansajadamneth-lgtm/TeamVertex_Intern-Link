# InternLink security audit and hardening record

Date: 2026-11-12
Branch: `feature/internlink-proposal-completion`
Scope: source-level review of Next.js API proxy, Express authentication, session management, access control, input validation, browser headers, GitHub CI and Atlas IP access list. This is **not** a penetration test or a guarantee of zero vulnerabilities.

## Findings and fixes applied

| Severity | Finding | Remediation |
| --- | --- | --- |
| High | Unused `client/lib/auth-store.ts` contained hard-coded plaintext demo credentials | File removed from current branch. **History still contains it**; never reuse those demo passwords. Rotate any real passwords that match. |
| High | Job deletion accepted `?permanent=true` and could erase a listing referenced by student applications | Removed permanent-delete branch; job closure retains recruitment/application records. |
| Medium | JWT verification did not pin an allowed algorithm and sessions defaulted to 30 days | Verification now permits HS256 explicitly; new default JWT and cookie lifetime 7 days. Explicit `JWT_EXPIRE` deployment configuration can override JWT TTL. |
| Medium | Protected APIs allowed accounts in Pending state (only Inactive blocked) | Deny Pending/Inactive access while retaining compatibility with older records missing status. Login also rejects non-active accounts. |
| Medium | Logout route lacked origin checks | Cross-site requests rejected; auth responses mark `Cache-Control: no-store`. |
| Medium | Browser-facing headers could be stricter | Next.js global headers now include anti-clickjacking, MIME nosniff, referrer and Permissions-Policy. Do not add an untested strict CSP that could break Next.js hydration. |
| Medium | Potentially large or malformed JWT strings and malformed claims | Reject absent/oversized tokens and non-ObjectId IDs before querying user. |
| Low | API error on missing JWT_SECRET revealed configuration details | Return generic authentication-unavailable error to clients; keep diagnostics server-side. |
| Low | Role and login validation | Existing role-based authorization, hashed passwords, HttpOnly/Secure/SameSite cookies, explicit field allowlists and rate limiting remain in place. |

## Verified Atlas network settings

- Project: Moneesha's Org / Project 0, Cluster0.
- IP access list contains 22 entries at audit time.
- **No `0.0.0.0/0` or `::/0` rule** was present.
- Render service ranges `74.220.52.0/24` and `74.220.60.0/24` are present.
- Review the *other* previously-approved IPs with the team/organization owner; do not blindly delete live developer addresses during the viva.

## Remaining risks and decisions

1. **Deploy the updated backend on Render Free** (`internlink-api`, feature branch). Vercel READY does not prove Render is running the same commit. Validate direct Render `/api/health` after deployment.
2. **Rotate credentials** if any historical hardcoded demo password was reused for actual accounts. Removing a file from the current Git tree does not purge the Git history.
3. **Check JWT_SECRET** in the Render environment: use a long, randomly-generated secret (32+ random bytes), and store exclusively in deployment secret settings. Rotating JWT_SECRET signs everyone out. Do not paste it into screenshots or GitHub.
4. **Check Atlas database user permissions**: a dedicated runtime user with only the required database read/write rights; avoid using an Atlas administrator user in `MONGO_URI`.
5. **Enable 2FA/MFA** on GitHub, Vercel, Render and MongoDB Atlas owners/admins. Keep team permissions least-privilege; do not leave AI client organization-wide write access enabled unless necessary.
6. **Rate limits are in-memory.** Render Free restarts reset counters and forwarded client IPs may aggregate through the Vercel proxy. A production high-scale service would require a shared external rate-limit store; don't buy a paid service for this academic demo.
7. **Password reset email is not configured**. Password recovery has intentionally honest failure messaging. Add secure, time-limited, single-use reset tokens only after a trusted mail provider is chosen.
8. **No comprehensive authenticated penetration test or dynamic scanner** has run. Test guest/student/employer/admin role boundaries, CSRF, login/session expiry, account suspension, pagination, and upload/link handling with dedicated nonproduction identities.
9. **No claim of zero vulnerabilities.** Review dependency advisories periodically and set up dependency updates through repository settings.

## Security verification workflow

CI: `.github/workflows/internlink-checks.yml` executes backend unit/regression tests, TypeScript validation and Next.js build on the feature branch.

Manual pre-viva checklist:
- Anonymous requests to `/api/admin/*`, `/api/cvs`, `/api/applications/me` and `/api/contact` GET must return 401/403 as appropriate.
- Students cannot create jobs, change company verification status or view other students' CVs/applications.
- Employers cannot verify their own company, view another company's applicants or update another employer's job.
- JWTs are HttpOnly cookies with Secure and SameSite=Lax in production; response JSON does not include JWT.
- Password changes revoke older session versions; suspended users cannot log in or use existing sessions.
- Cross-site mutations and cross-site logout requests are rejected.
- Job creation cannot target unverified companies; deleting a job closes it instead of erasing student applications.
- Repeat the registration/login/verified-company/applications workflow using dedicated demo accounts. Keep Render Free.

**Release rule:** Only publish validated changes from `feature/internlink-proposal-completion`; the protected `main` branch is left unchanged.
