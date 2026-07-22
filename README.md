# G5 Vocabulary Trainer

A personal vocabulary learning web app with flashcards, spaced review, user login, admin tools, and CSV word import.

## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- SQLite for local development
- PostgreSQL planned for production
- Vercel deployment

## Getting started

Install dependencies:

    npm install

Create a local `.env` file:

    DATABASE_URL="file:./dev.db"
    SESSION_SECRET="your-local-session-secret"

Generate a session secret:

    openssl rand -base64 32

Run Prisma migrations:

    npx prisma migrate dev

Seed the local database:

    npm run seed

Run the development server:

    npm run dev

Open:

    http://localhost:3000

## Demo login

Local seed creates a demo admin user:

    email: demo@g5.local
    password: demo1234

## Environment variables

Local development:

    DATABASE_URL="file:./dev.db"
    SESSION_SECRET="your-local-session-secret"

Production example:

    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
    SESSION_SECRET="your-production-session-secret"

Never commit `.env`, local database files, cookies, or secrets.

## Database commands

Run migrations:

    npx prisma migrate dev

Generate Prisma client:

    npx prisma generate

Open Prisma Studio:

    npx prisma studio

Seed database:

    npm run seed

## Features

- Login with session cookie
- Protected dashboard and learning pages
- Flashcard review flow
- G5 review engine
- User-specific learning state
- Admin word creation
- Admin user creation
- CSV template download
- CSV word import
- Global and personal word support

## Deployment notes

The app is planned for Vercel deployment.

Before production deployment:

1. Create a PostgreSQL database.
2. Set production `DATABASE_URL`.
3. Set a new production `SESSION_SECRET`.
4. Switch Prisma datasource from SQLite to PostgreSQL.
5. Run production migrations.
6. Deploy through Vercel.

Do not hardcode domains or secrets in the repository.
