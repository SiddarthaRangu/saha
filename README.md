# SAHA - Smart Application Helper Assistant

**SAHA** is an AI-powered job application tracker that helps you manage your job search pipeline and optimize your resume for each application.

## Features

- 📋 **Job Tracker** - Track applications with status management (Bookmarked → Applied → Interviewing → Offered → Rejected)
- 🤖 **AI Resume Analysis** - Get instant feedback on resume-JD match with missing keywords and improvement suggestions
- 👤 **User Accounts** - Secure authentication with email/password
- 📊 **Dashboard Analytics** - View application statistics and progress

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v3
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Gemini 1.5 Flash
- **Authentication**: NextAuth.js with credentials provider

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd saha-app
npm install
```

### 2. Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and set the following variables:

- **DATABASE_URL**: Your PostgreSQL connection string
- **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
- **NEXTAUTH_URL**: Your app URL (http://localhost:3000 for local)
- **GOOGLE_API_KEY**: Your Google Gemini API key

### 3. Database Setup

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Migrations

When the schema changes, run:

```bash
npx prisma migrate dev --name description_of_change
```

To reset the database (⚠️ deletes all data):

```bash
npx prisma migrate reset
```

## Deployment

### Environment Variables (Production)

Ensure these are set in your deployment platform:

- `DATABASE_URL` - Production PostgreSQL URL
- `NEXTAUTH_SECRET` - Strong random secret (32+ characters)
- `NEXTAUTH_URL` - Your production domain (https://yourdomain.com)
- `GOOGLE_API_KEY` - Your Google Gemini API key

### Build and Deploy

```bash
npm run build
npm start
```

### Recommended Platforms

- **Vercel** - Easiest deployment for Next.js
- **Railway** - Good for PostgreSQL + Next.js
- **Render** - Alternative with database support

## Project Structure

```
saha-app/
├── app/
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (dashboard)/         # Protected dashboard pages
│   ├── (guest)/             # Public pages (landing, guest analysis)
│   └── api/                 # API routes
├── components/
│   ├── features/            # Feature-specific components
│   ├── shared/              # Shared components (Navbar, Sidebar)
│   └── ui/                  # Base UI components (Button, Card, Input)
├── lib/                     # Utilities (Prisma client)
├── prisma/                  # Database schema and migrations
└── services/                # Business logic (trackerService)
```

## User Guide

### Getting Started

1. **Register** - Create an account at `/auth/register`
2. **Login** - Sign in at `/auth/login`
3. **Add Jobs** - Track applications in the Tracker page
4. **Analyze Resume** - Upload your resume and JD for AI analysis
5. **Manage Status** - Click status badges to update application progress

### Guest Features

- **Quick Analysis** at `/analyze` - Try resume analysis without an account

## Troubleshooting

### "Failed to analyze resume"
- Check that `GOOGLE_API_KEY` is set in `.env`
- Verify the API key is valid at Google AI Studio

### Database connection errors
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Run `npx prisma migrate deploy`

### "User not found" on login
- Register a new account first
- Check database connection

## Development

### Adding New Features

1. Create components in `components/features/`
2. Add API routes in `app/api/`
3. Update database schema in `prisma/schema.prisma`
4. Run migrations: `npx prisma migrate dev`

### Code Style

- Use Tailwind CSS for styling
- Follow the existing component structure
- Keep API routes thin, business logic in `services/`

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
