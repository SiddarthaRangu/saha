SAHA - Technical Architecture & Implementation Master Plan (Phases 1-3)
=======================================================================

> Note: This document serves as the Single Source of Truth for the engineering implementation of SAHA. It is designed to be ingested by AI coding assistants (Cursor) to generate production-ready code. Architectural Standard: This system follows a Modular Monolith architecture within the Next.js ecosystem, prioritizing stateless APIs, strict separation of concerns, and a "Career Modern" visual identity. Language Standard: JavaScript (ES6+). No TypeScript. JSDoc is used for type documentation where necessary.

* * * * *

1\. System Architecture Overview
--------------------------------

### 1.1 Technology Stack & Philosophy

### Core Technology Decisions

```
⚡ SAHA JAVASCRIPT ECOSYSTEM

🎯 Technology Philosophy:
├── Frontend: Next.js 14+ (App Router) - React Server Components
├── Styling: Tailwind CSS + shadcn/ui + Phosphor Icons
├── Backend: Next.js API Routes (Serverless Functions)
├── Database: PostgreSQL (Neon/Supabase) via Prisma ORM
├── Auth: NextAuth.js (v5) - Stateless JWT
├── AI: Google Gemini (Analysis) + OpenAI (Generation)
└── Infrastructure: Vercel (Edge Network)

📊 Performance Targets:
├── Core Web Vitals: All Green (LCP < 2.5s)
├── API Latency: < 300ms (Non-AI routes)
├── AI Streaming: < 1s Time-to-First-Byte
├── Guest Experience: Zero-friction entry (Cookie-based persistence)

```

### Directory Structure (Feature-First)

```
/saha-app
├── /app                       # Next.js App Router
│   ├── /(auth)                # Login, Signup (Grouped)
│   ├── /(dashboard)           # Protected: Tracker, Analysis
│   ├── /(guest)               # Public: Landing, Guest Tools
│   ├── /api                   # API Routes
│   │   ├── /auth              # NextAuth endpoints
│   │   ├── /ai                # Streaming AI endpoints
│   │   └── /cron              # Cleanup jobs
│   ├── layout.js              # Root Layout (Fonts/Providers)
│   └── globals.css            # Tailwind directives
├── /components
│   ├── /ui                    # shadcn/ui (Buttons, Cards)
│   ├── /shared                # Navbar, Footer, Shell
│   └── /features              # Logic-heavy components
│       ├── /tracker           # Job Board, Status Columns
│       ├── /analysis          # Resume Upload, Score Gauge
│       └── /content           # Cover Letter Generators
├── /lib                       # Core Infrastructure
│   ├── prisma.js              # DB Client Singleton
│   ├── openai.js              # AI Client Config
│   ├── gemini.js              # AI Client Config
│   └── utils.js               # CN helper, Date formatters
├── /services                  # Business Logic (The "Backend")
│   ├── authService.js         # User/Guest logic
│   ├── aiService.js           # Prompt Engineering & Calls
│   ├── parserService.js       # PDF Extraction (pdf-parse)
│   └── trackerService.js      # CRUD for Jobs
├── /styles                    # Design Tokens
│   └── fonts.js               # PT Mono & Cause config
├── /prisma                    # Database
│   └── schema.prisma          # Data Models
└── tailwind.config.js         # Design System Config

```

* * * * *

2\. Database Design (Prisma)
----------------------------

**File:** `/prisma/schema.prisma`

This schema handles the dual nature of SAHA: **Guest Users** (transient, IP-based) and **Registered Users** (persistent).

```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// --------------------------------------
// 1. User Identity & Access
// --------------------------------------

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relationships
  resumes       Resume[]
  applications  JobApplication[]
  usageLogs     AIRequestLog[]
}

// --------------------------------------
// 2. Guest Usage (Rate Limiting)
// --------------------------------------

model GuestUsage {
  ipAddress     String    @id
  requestCount  Int       @default(0)
  lastReset     DateTime  @default(now())
}

// --------------------------------------
// 3. Core Domain Models
// --------------------------------------

model Resume {
  id            String   @id @default(cuid())
  userId        String?  // Nullable: Guest data is temporary
  label         String   @default("Master Resume")
  extractedText String   @db.Text
  fileUrl       String?  // Optional: S3 URL if we store files later
  createdAt     DateTime @default(now())

  user          User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model JobApplication {
  id            String    @id @default(cuid())
  userId        String
  companyName   String
  roleTitle     String
  jdText        String    @db.Text
  status        Status    @default(BOOKMARKED)
  matchScore    Int?      // 0-100
  notes         String?   @db.Text
  appliedDate   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Relations to generated content
  coverLetters  GeneratedContent[]
}

model GeneratedContent {
  id            String    @id @default(cuid())
  applicationId String
  type          ContentType
  content       String    @db.Text
  createdAt     DateTime  @default(now())

  application   JobApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
}

// --------------------------------------
// 4. Analytics & Cost Control
// --------------------------------------

model AIRequestLog {
  id            String   @id @default(cuid())
  userId        String?
  provider      String   // "openai" | "gemini"
  tokensUsed    Int
  feature       String   // "analysis" | "cover_letter"
  createdAt     DateTime @default(now())

  user          User?    @relation(fields: [userId], references: [id])
}

// --------------------------------------
// Enums
// --------------------------------------

enum Status {
  BOOKMARKED
  APPLIED
  INTERVIEWING
  OFFERED
  REJECTED
}

enum ContentType {
  COVER_LETTER
  LINKEDIN_MESSAGE
  COLD_EMAIL
}

```

* * * * *

3\. Phase 1: Foundation & Workflow
----------------------------------

### 3.1 Design System Integration (Tailwind)

**File:** `tailwind.config.js`

Implements the "Career Modern" visual identity.

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Theme (Primary)
        background: "#F7F7F8",
        surface: "#FFFFFF",
        primary: "#1C1C1E",     // Dark Gray for Text/Buttons
        secondary: "#4B5563",   // Muted Text
        accent: "#E76F51",      // The Signal Color (Coral)
        "accent-success": "#2A9D8F", // Teal
        border: "#E5E7EB",

        // Dark Theme (Optional Support)
        dark: {
          bg: "#0E0E11",
          surface: "#16161A",
          text: "#F9FAFB"
        }
      },
      fontFamily: {
        mono: ["PT Mono", "monospace"], // Headings
        sans: ["Cause", "sans-serif"],  // Body
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

```

### 3.2 Guest Middleware (Access Control)

**File:** `/middleware.js`

Strictly enforces the "3 free tries" rule for non-logged-in users.

```
import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = await getToken({ req })
  const { pathname } = req.nextUrl

  // 1. If user is logged in, allow everything
  if (token) return NextResponse.next()

  // 2. Check Guest Limits for AI endpoints
  if (pathname.startsWith('/api/ai')) {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'

    // Call internal rate limit checker (conceptual)
    // Note: In Middleware we usually call Edge Config or KV
    // For MVP, we can handle this inside the API route itself
    // to keep middleware lightweight.
    return NextResponse.next()
  }

  // 3. Protect Dashboard Routes
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/ai/:path*'],
}

```

### 3.3 Job Tracker Service (Backend)

**File:** `/services/trackerService.js`

Handles the core CRUD workflow.

```
import prisma from "@/lib/prisma"

/**
 * Creates a new job application entry.
 * @param {string} userId
 * @param {Object} data - { companyName, roleTitle, jdText }
 */
export async function createApplication(userId, data) {
  return await prisma.jobApplication.create({
    data: {
      userId,
      companyName: data.companyName,
      roleTitle: data.roleTitle,
      jdText: data.jdText,
      status: "BOOKMARKED"
    }
  })
}

/**
 * Updates application status (Kanban move).
 * @param {string} applicationId
 * @param {string} status - APPLIED, INTERVIEWING...
 */
export async function updateStatus(applicationId, status) {
  return await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status }
  })
}

/**
 * Retrieves all jobs for the dashboard.
 */
export async function getUserApplications(userId) {
  return await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' }
  })
}

```

* * * * *

4\. Phase 2: Core AI Analysis
-----------------------------

### 4.1 PDF Parsing Service

**File:** `/services/parserService.js`

Uses `pdf-parse` to turn uploaded Resumes into raw text strings for the AI.

```
import pdf from 'pdf-parse'

export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer)
    // Clean text: remove excessive newlines/spaces
    const cleanText = data.text.replace(/\\\\n+/g, ' ').trim()
    return cleanText
  } catch (error) {
    console.error("PDF Parse Error:", error)
    throw new Error("Failed to parse resume PDF")
  }
}

```

### 4.2 AI Analysis Logic (Gemini 1.5 Pro)

**File:** `/app/api/ai/analyze/route.js`

This is the brain of Phase 2. It compares the Resume Text vs. JD Text.

```
import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export async function POST(req) {
  try {
    const { resumeText, jdText, userId } = await req.json()

    // 1. Construct the Prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })

    const prompt = `
      Act as a Senior Technical Recruiter.
      Compare the following Resume against the Job Description.

      RESUME:
      ${resumeText.substring(0, 8000)}

      JOB DESCRIPTION:
      ${jdText.substring(0, 5000)}

      Output strictly valid JSON (no markdown) with this schema:
      {
        "matchScore": number (0-100),
        "keyMissingSkills": ["skill1", "skill2"],
        "resumeImprovements": ["specific actionable advice 1", "advice 2"],
        "summary": "Short 2 sentence verdict"
      }
    `

    // 2. Call AI
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // 3. Clean and Parse JSON
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const analysisData = JSON.parse(cleanJson)

    // 4. Log Usage (Async, don't block response)
    if (userId) {
      prisma.aIRequestLog.create({
        data: {
          userId,
          provider: "gemini",
          feature: "analysis",
          tokensUsed: 0 // Gemini doesn't always return token count in free tier, estimate or skip
        }
      }).catch(console.error)
    }

    return NextResponse.json(analysisData)

  } catch (error) {
    console.error("AI Analysis Failed:", error)
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    )
  }
}

```

### 4.3 Analysis UI Component

**File:** `/components/features/analysis/ScoreGauge.jsx`

Visualizes the match score using the Accent color (`#E76F51`).

```
import { PiWarningCircle, PiCheckCircle } from "react-icons/pi"

export default function ScoreGauge({ score, loading }) {
  if (loading) return <div className="animate-pulse h-32 w-32 rounded-full bg-gray-200" />

  // Color logic based on score
  const getColor = (s) => {
    if (s >= 80) return "text-accent-success" // Green/Teal
    if (s >= 50) return "text-yellow-500"
    return "text-accent" // Coral/Red
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-xl shadow-sm">
      <div className={`text-5xl font-mono font-bold ${getColor(score)}`}>
        {score}%
      </div>
      <span className="text-secondary text-sm font-sans mt-2 uppercase tracking-wide">
        Match Score
      </span>
    </div>
  )
}

```

* * * * *

5\. Phase 3: Content Generation (Streaming)
-------------------------------------------

### 5.1 Content Generator Service (OpenAI GPT-4o)

**File:** `/app/api/ai/generate/route.js`

Uses Vercel AI SDK to **stream** the cover letter text, creating that "AI typing" effect.

```
import { OpenAI } from "openai"
import { OpenAIStream, StreamingTextResponse } from "ai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Vercel AI SDK Config
export const runtime = 'edge'

export async function POST(req) {
  const { type, resumeText, jdText } = await req.json()

  let systemPrompt = ""
  if (type === 'COVER_LETTER') {
    systemPrompt = "You are an expert career coach. Write a professional, concise cover letter based on the candidate's resume and the job description. Tone: Confident but humble."
  } else if (type === 'LINKEDIN') {
    systemPrompt = "Write a short (under 300 chars) LinkedIn connection request to the hiring manager. Professional and warm."
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Resume: ${resumeText}\\\\n\\\\nJD: ${jdText}` }
    ],
  })

  // Convert to Vercel stream
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

```

### 5.2 Content Generation UI

**File:** `/components/features/content/GeneratorPanel.jsx`

The user interface for Phase 3. Left side: Context. Right side: Generated Output.

```
"use client"
import { useState } from "react"
import { useCompletion } from "ai/react" // Vercel AI Hook
import { PiCopy, PiPenNib } from "react-icons/pi"
import { Button } from "@/components/ui/button"

export default function GeneratorPanel({ resumeText, jdText }) {
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/ai/generate',
  })

  const handleGenerate = (type) => {
    complete({ type, resumeText, jdText })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Control Panel */}
      <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
        <h3 className="font-mono text-lg font-bold text-primary">Content Generator</h3>
        <p className="text-sm text-secondary">
          Choose what you need. We'll use your current resume and the active JD.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => handleGenerate('COVER_LETTER')}
            disabled={isLoading}
            className="w-full justify-start gap-2"
          >
            <PiPenNib /> Generate Cover Letter
          </Button>
          <Button
            onClick={() => handleGenerate('LINKEDIN')}
            disabled={isLoading}
            variant="outline"
            className="w-full justify-start gap-2"
          >
            <PiPenNib /> LinkedIn Connection Msg
          </Button>
        </div>
      </div>

      {/* Output Panel (Streaming Area) */}
      <div className="bg-background p-6 rounded-lg border border-border relative min-h-[400px]">
        {completion ? (
          <div className="prose prose-sm max-w-none font-sans text-primary whitespace-pre-wrap">
            {completion}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-secondary text-sm italic">
            Select an option to start writing...
          </div>
        )}

        {completion && !isLoading && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4"
            onClick={() => navigator.clipboard.writeText(completion)}
          >
            <PiCopy className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}

```

* * * * *

6\. Frontend: Application Layout & Entrance
-------------------------------------------

### 6.1 Landing Page (Guest Entrance)

**File:** `/app/(guest)/page.js`

This is the first screen. Minimalist, high utility.

```
import Link from "next/link"
import { PiArrowRight, PiUploadSimple } from "react-icons/pi"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">

      {/* Hero Section */}
      <div className="max-w-2xl text-center space-y-6 mb-12">
        <h1 className="font-mono text-4xl md:text-6xl font-bold text-primary tracking-tight">
          SAHA
        </h1>
        <p className="font-sans text-lg text-secondary max-w-lg mx-auto">
          We handle applications. You focus on preparation.
        </p>
      </div>

      {/* Guest Action Card */}
      <div className="w-full max-w-3xl bg-surface border border-border rounded-xl shadow-sm p-8">
        <div className="grid md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-border">

          {/* Left: Quick Analysis */}
          <div className="space-y-4 pr-4">
            <h3 className="font-mono font-bold text-primary">Quick Check</h3>
            <p className="text-sm text-secondary">
              Paste a JD and check your Resume match score instantly. No sign-up required.
            </p>
            <Link href="/guest/analyze">
              <Button className="w-full bg-primary text-white hover:bg-black">
                Analyze Now <PiArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right: Full Tracker */}
          <div className="space-y-4 pt-8 md:pt-0 md:pl-8">
            <h3 className="font-mono font-bold text-primary">Job Tracker</h3>
            <p className="text-sm text-secondary">
              Organize your search. Track applications, interviews, and offers in one place.
            </p>
            <Link href="/auth/register">
              <Button variant="outline" className="w-full border-primary text-primary">
                Create Account
              </Button>
            </Link>
          </div>

        </div>
      </div>

    </main>
  )
}

```

* * * * *

7\. Future Phases (Summary)
---------------------------

### Phase 4: Preparation Support

-   **Database Update:** Add `InterviewPrep` model linked to `JobApplication`.
-   **Feature:** Use AI to generate 10 interview questions specific to the `jdText` stored in the application.

### Phase 5: BYOK (Bring Your Own Key)

-   **Settings Page:** Add input fields for `OPENAI_API_KEY` and `GEMINI_API_KEY`.
-   **Encryption:** Store keys encrypted in the DB.
-   **Logic:** Update `aiService.js` to check `user.preferences.apiKeys` before falling back to the system env variables.

### Phase 6: Resume Infrastructure

-   **LaTeX Engine:** Integrate a LaTeX compiler API (or local WASM).
-   **Builder UI:** A form-based interface that maps fields to the LaTeX template variables.

* * * * *

8\. Implementation Checklist (For Cursor)
-----------------------------------------

1.  **Initialize**: Run `npx create-next-app@latest saha-app` (Select: App Router, Tailwind, No TypeScript).
2.  **Dependencies**: Install `prisma`, `@prisma/client`, `next-auth`, `pdf-parse`, `openai`, `@google/generative-ai`, `ai`, `react-icons`, `clsx`, `tailwind-merge`.
3.  **Database**: Set up the `schema.prisma` file and run `npx prisma db push`.
4.  **Styles**: Copy the `tailwind.config.js` configuration.

6.  **Backend**: Implement `auth/[...nextauth]` and the AI route handlers.
7.  **Frontend**: Build the `LandingPage` and `GeneratorPanel` components.
