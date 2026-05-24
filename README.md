# TaskFlow API

A robust REST API built with Next.js (App Router), TypeScript, and Supabase.

## Architecture
This project strictly follows **Clean Architecture** principles to separate concerns, improve maintainability, and isolate database logic from API routes.

* **Domain Layer (`domain/types.ts`):** Contains the core TypeScript interfaces (`User`, `Project`, `Task`). No `any` types are used.
* **Repository Layer (`repositories/`):** Handles all direct database interactions with Supabase. Wrapped in strict `try/catch` blocks for reliability.
* **Use-Case Layer (`use-cases/`):** Contains the core business logic, data validation, and an in-memory caching mechanism.
* **API/Controller Layer (`app/api/`):** Next.js Route Handlers. These files contain absolutely zero business or database logic. They only handle HTTP requests, extract headers, pass data to the use-cases, and return HTTP responses.

## Scenarios Addressed
1.  **Reliability:** All database calls in the repository layer are wrapped in `try/catch` blocks to prevent silent failures. Errors are actively logged to the console and cleanly returned to the client.
2.  **Performance:** An in-memory cache mechanism (using a JavaScript `Map`) was implemented in `projectsUseCase.ts`. Read operations for user projects check the cache first. Write/Delete operations automatically invalidate the cache to ensure data freshness.

## Database Security
* **Row Level Security (RLS)** is fully enabled on all tables (`users`, `projects`, `tasks`).
* **PostgreSQL Policies** are strictly enforced so users can only view, update, or delete data where their `auth.uid()` matches the `owner_id`.
* Foreign key constraints utilize `ON DELETE CASCADE` to ensure orphaned records do not clutter the database.
* The raw SQL used to set this up is available in `/supabase/migrations/001_init.sql`.

## Environment Setup
Do not commit your `.env.local` file. Create a `.env.local` file at the root of the project with the following required variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key
\`\`\`