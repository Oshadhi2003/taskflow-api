TaskFlow API
A robust REST API built with Next.js (App Router), TypeScript, and Supabase. This project was developed as a technical assessment and strictly follows Clean Architecture principles to separate concerns, improve maintainability, and isolate database logic from API routes.

🏗️ Architecture Overview
This project is structured into distinct layers to ensure scalability and clean code separation:

Domain Layer (domain/): Contains the core TypeScript interfaces and types (e.g., User, Project, Task). No third-party types are used here.

Repository Layer (repositories/): Handles all direct database interactions with Supabase. Wrapped in strict try/catch blocks for reliability.

Use-Case Layer (use-cases/): Contains the core business logic, data validation, and an in-memory caching mechanism to optimize data fetching.

App / Controller Layer (app/api/): Next.js Route Handlers. These files contain zero business or database logic, acting solely as controllers to parse requests and return HTTP responses.

🚀 Key Features
Complete Authentication: Secure User Sign Up and Sign In flows using Supabase Auth.

Robust Error Handling: Graceful handling of infrastructure errors, including Supabase rate limits (e.g., email send limits) and data conflicts (e.g., user already exists).

Performance Optimization: Custom in-memory caching mechanism to reduce redundant database queries.

Project Management Endpoints: Secured endpoints for fetching and managing project data (/api/projects) requiring Bearer token authorization.

🛠️ Tech Stack
Framework: Next.js (App Router)

Language: TypeScript

Database & Auth: Supabase

API Testing: Thunder Client

📋 Getting Started
Prerequisites
Node.js installed on your machine.

A Supabase project setup with Authentication enabled.

Installation
Clone the repository:

Bash
git clone https://github.com/Oshadhi2003/taskflow-api.git
cd taskflow-api
Install dependencies:

Bash
npm install
Set up your environment variables. Create a .env.local file in the root directory and add your Supabase credentials:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Run the development server:

Bash
npm run dev
🧪 API Verification
Comprehensive end-to-end testing of the API endpoints (including successful responses and error states) was conducted using Thunder Client.

Detailed proof of functionality, including request payloads, response bodies, and HTTP status codes, can be found in the included API_Verification_Proof.pdf document located in the root of this repository.
