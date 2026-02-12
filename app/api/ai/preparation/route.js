import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export async function POST(req) {
    try {
        const { companyName, roleTitle, jdText, userId } = await req.json()

        // 1. Validation
        if (!roleTitle || !jdText) {
            return NextResponse.json(
                { error: "Missing required fields: roleTitle and jdText are mandatory." },
                { status: 400 }
            )
        }

        // 2. Configure Model for JSON Mode
        // specific "responseMimeType" guarantees the structure
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.4, // Lower temperature for more consistent, factual lists
            }
        })

        // 3. Construct Prompt
        const prompt = `
      Act as an Expert Technical Interview Coach.
      Prepare a candidate for an interview at ${companyName || "a specific company"} for the role of ${roleTitle}.
      
      JOB DESCRIPTION:
      ${jdText.substring(0, 10000)}

      Based ONLY on the job description and standard industry expectations for this role, generate a preparation guide.
      
      Return a JSON object with this exact schema:
      {
        "keyTopics": [
          "string: A technical concept or domain knowledge specific to this JD to study"
        ],
        "likelyInterviewQuestions": [
          "string: A specific question likely to be asked based on the stack/responsibilities"
        ],
        "preparationChecklist": [
          "string: A concrete actionable step (e.g., 'Review System Design for High Scalability')"
        ]
      }
    `

        // 4. Execute AI
        const result = await model.generateContent(prompt)
        const response = await result.response

        // In JSON mode, text() returns the valid JSON string directly
        const plan = JSON.parse(response.text())

        // 5. Log Usage (Fire and Forget)
        if (userId) {
            prisma.aIRequestLog.create({
                data: {
                    userId,
                    provider: "gemini-2.0-flash-lite",
                    feature: "preparation_v1",
                    tokensUsed: 0
                }
            }).catch(console.error)
        }

        return NextResponse.json(plan)

    } catch (error) {
        console.error("Preparation AI Error:", error)
        return NextResponse.json(
            { error: "Failed to generate preparation plan" },
            { status: 500 }
        )
    }
}
