import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"

export async function POST(req) {
    try {
        let { resumeText, jdText, userId } = await req.json()
        const session = await getServerSession(authOptions)
        const currentUserId = session?.user?.id

        if (!jdText) {
            return NextResponse.json({ error: "Missing JD text" }, { status: 400 })
        }

        // If resumeText is missing or placeholder, try to fetch from DB
        if (!resumeText || resumeText === "FETCH_FROM_DB") {
            const effectiveUserId = userId || currentUserId
            if (!effectiveUserId) {
                return NextResponse.json({ error: "Please upload a resume first or log in." }, { status: 400 })
            }

            const latestResume = await prisma.resume.findFirst({
                where: { userId: effectiveUserId },
                orderBy: { createdAt: 'desc' }
            })

            if (!latestResume) {
                return NextResponse.json({ error: "No resume found in your profile. Please upload one in the Analysis section." }, { status: 400 })
            }
            resumeText = latestResume.extractedText
        }

        // 1. Configure Model for JSON Mode
        // Gemini 2.0 Flash Lite with strict JSON MIME type
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.2, // Low temp for analytical precision
            }
        })

        // 2. Construct Prompt
        const prompt = `
      Act as a Senior Technical Recruiter.
      Compare the following Resume against the Job Description.

      RESUME TEXT:
      ${resumeText.substring(0, 20000)}

      JOB DESCRIPTION:
      ${jdText.substring(0, 10000)}

      Analyze the match.
      Output a JSON object with this exact schema:
      {
        "matchScore": number (0-100),
        "missingKeywords": [
          "string: critical hard skill 1",
          "string: critical hard skill 2"
        ],
        "improvementSuggestions": [
          "string: actionable advice 1",
          "string: actionable advice 2",
          "string: actionable advice 3"
        ],
        "executiveSummary": "string: 2 sentence verdict"
      }
    `

        // 3. Call AI
        const result = await model.generateContent(prompt)
        const response = await result.response

        // 4. Parse Response (Guaranteed JSON by responseMimeType)
        const analysisData = JSON.parse(response.text())

        // 5. Log Usage (Async)
        if (userId) {
            prisma.aIRequestLog.create({
                data: {
                    userId,
                    provider: "gemini-2.0-flash-lite",
                    feature: "analysis_v1",
                    tokensUsed: 0
                }
            }).catch(e => console.error("Failed to log usage:", e))
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
