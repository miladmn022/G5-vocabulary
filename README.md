# G5 Vocabulary

G5 Vocabulary is a small vocabulary training app I’m building for structured word review and daily practice.

The idea is simple: add words, review them as flashcards, and let the app decide when each word should come back based on how well it was remembered.

## What it does

- User login with session-based authentication
- Flashcard learning flow
- Review buttons: Again, Hard, Good, Easy
- Personal learning progress per user
- Admin area for managing words and users
- CSV template download for bulk word import
- CSV import for adding multiple words at once
- Global words for all users
- Personal words for individual users
- Dashboard with basic learning stats

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Vercel

## Local setup

Install dependencies:

    npm install

Create a `.env` file:

    DATABASE_URL="your-database-url"
    SESSION_SECRET="your-session-secret"

Generate a session secret:

    openssl rand -base64 32

Run database migrations:

    npx prisma migrate dev

Seed the database:

    npm run seed

Start the app:

    npm run dev

Open:

    http://localhost:3000

## Database

The app uses Prisma with PostgreSQL.

Useful commands:

    npx prisma migrate dev
    npx prisma generate
    npx prisma studio
    npm run seed

## CSV import format

The import file should be a CSV with these columns:

    text,meaning,synonyms,antonyms,example,level

Required columns:

    text
    meaning

Optional columns:

    synonyms
    antonyms
    example
    level

A downloadable CSV template is available inside the app.

## Notes

This is an active personal project, so the structure may change as the product grows.

Secrets, local database files, cookies, and environment files should never be committed.
