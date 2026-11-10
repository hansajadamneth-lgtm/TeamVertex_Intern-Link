# InternLink Express backend

## Run
Copy `.env.example` to `.env`, supply `MONGO_URI` and `JWT_SECRET`,
then from the monorepo root run `npm install` and
`npm run dev --workspace=server`.

## CV API (student login required)
- `GET /api/cvs`: list user's CV versions
- `POST /api/cvs`: create a CV version
- `PUT /api/cvs/:id`: update own version, `isPrimary:true` sets main version
- `DELETE /api/cvs/:id`: delete own CV version

CV records include name, headline, summary, skills and arrays of education,
experience, and projects. Maximum 10 versions per student. Primary CV skills
sync to the User document for application matching.

## Recommendation API (student login required)
`GET /api/recommendations` returns only jobs from verified employers with
active postings and unexpired deadlines. Uses transparent scoring:
85% required skill overlap, 10% preferred location, 5% preferred category.
In the current implementation the user location is used as a location preference.
This is a deterministic ranking algorithm, not a trained AI model.

## Access and security
- Authenticate requests via JWT bearer header or httpOnly cookie.
- Students can only edit their own CVs and submit their own applications.
- Employers must register a company and an administrator must verify it before
  their jobs can be posted and shown to students.
- Application fit score is never randomized.
- Set unique production `JWT_SECRET`; configure MongoDB, CORS, HTTPS, and mail service before deployment.

## Checks
`npm test --workspace=server` tests scoring utility; application security,
registration, role permissions and MongoDB paths require integration tests.
