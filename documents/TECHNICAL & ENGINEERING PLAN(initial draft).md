TECHNICAL & ENGINEERING PLAN(initial draft)

1\. Tech Stack (Confirmed)
--------------------------

Frontend:

- Next.js (App Router)

- Tailwind CSS

- shadcn/ui

Backend:

- Next.js API Routes

Database:

- PostgreSQL (Neon)

- Prisma ORM

Authentication:

- Email & Password

- JWT / NextAuth

AI:

- Google Gemini

- OpenAI

Infrastructure:

- Docker

- GitHub Actions

- Vercel (deployment)

* * * * *

2\. Core System Architecture
----------------------------

Browser (Next.js UI)

↓

API Layer (Next.js Routes)

↓

AI Service Layer (Gemini / OpenAI)

↓

PostgreSQL Database

Supporting layers:

- Auth middleware

- Rate limiting

- Logging

* * * * *

3\. Data Models
---------------

User

- id

- name

- email

- password_hash

- created_at

Resume

- id

- user_id

- file_url

- extracted_text

- created_at

JobApplication

- id

- user_id

- company

- role

- jd_text

- status

- notes

- created_at

AIRequestLog

- id

- user_id

- provider

- tokens_used

- request_type

- timestamp

GuestUsage

- guest_id

- ip_address

- usage_count

- last_used_at

* * * * *

4\. Phase Structure (No Timeline)
---------------------------------

### Phase 1 --- Foundation

Goal:

Build core backend and authentication.

Includes:

- Next.js setup

- Prisma schema

- Auth system

- Guest usage tracking

- Resume storage

- Job tracker CRUD

* * * * *

### Phase 2 --- Core AI Application Support

Goal:

Make AI actually useful.

Includes:

- Resume vs JD analysis

- Resume improvement suggestions

- Cover letter generation

- Emails and messages

* * * * *

### Phase 3 --- Preparation Support

Goal:

Guide users after applying.

Includes:

- Role-based concepts

- Company-specific topics

- Interview question suggestions

* * * * *

### Phase 4 --- BYOK Mode

Goal:

Allow user-provided API keys.

Includes:

- Gemini key input

- OpenAI key input

- Provider switching

- Key validation

* * * * *

### Phase 5 --- Resume System

Goal:

Structured resume generation.

Includes:

- LaTeX templates

- Field-based input

- PDF compilation

- Versioning

* * * * *

5\. Engineering Principles
--------------------------

-   Stateless APIs

- Cost-aware AI usage

- Rate limiting

- Input validation

- Secure auth

- Modular services

* * * * *

6\. Deployment Strategy
-----------------------

Initial:

- Vercel

- Environment variables

- CI with GitHub Actions

Later:

- Dockerized services

- External DB

- Load balancing