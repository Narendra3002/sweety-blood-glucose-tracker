# Sweety – Blood Glucose Tracker

A complete fresher-level full-stack assignment implementation for the Kenpath Junior Full Stack Developer – JavaScript & AI task.

## Stack
- React + Vite
- Node.js + Express
- PostgreSQL
- bcrypt
- JWT
- Jest + Supertest
- React Testing Library + Vitest

## Features
### Authentication
- Sign up with name, email and password
- Login
- bcrypt password hashing
- JWT authentication
- Users can access only their own readings

### Readings
- Add, view, edit and delete readings
- Four slots: Morning (fasting), After breakfast, After lunch, After dinner
- Whole-number validation from 40 to 600 mg/dl
- One reading per slot per day
- Maximum four readings per day
- Future dates rejected
- Clear UI errors

### Reports
- Daily
- Month-to-date
- Previous complete month
- Highest, lowest, average rounded to 1 decimal, count
- Daily report lists individual readings
- Friendly empty states

### Extra
- Pagination on GET /api/readings?page=1&limit=20
- Responsive UI
- Demo seed data
- Backend tests
- Frontend tests

## Requirements
- Node.js 20+
- PostgreSQL 14+

## Database
Create a database named `sweety`.

## Server setup

```bash
cd server
npm install
copy .env.example .env
```

Edit `.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/sweety
JWT_SECRET=replace_with_a_long_random_secret
```

Initialize tables:

```bash
npm run db:init
```

Seed demo data:

```bash
npm run seed
```

Start API:

```bash
npm run dev
```

API runs on `http://localhost:5000`.

## Client setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the Vite URL shown by the terminal.

## Demo account

Email:
`demo@sweety.com`

Password:
`DemoPassword123`

## Tests

Backend:

```bash
cd server
npm test
```

Frontend:

```bash
cd client
npm test
```

## Suggested manual demo

1. Register a new user.
2. Log in.
3. Add Morning reading.
4. Add the other three slots.
5. Try adding a fifth reading and observe the validation.
6. Try a value below 40 or above 600.
7. Edit a reading.
8. Delete a reading.
9. Open Daily report.
10. Open Month-to-date report.
11. Open Previous month report.
12. Log out and log in as another user to verify data isolation.

## Assumptions

- A reading's date is stored as a PostgreSQL DATE.
- The four slot names are fixed by the assignment.
- JWT is stored in localStorage for this assignment.
- The UI is intentionally simple because the assignment prioritizes working features, validation, readable code and tests.

## Improvements with more time

- Production deployment
- Docker Compose
- Charts
- Redis report caching
- Doctor role
- More comprehensive end-to-end tests
- Stronger accessibility and visual design

