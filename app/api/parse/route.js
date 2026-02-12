import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { extractTextFromPDF } from "@/services/parserService"
import prisma from "@/lib/prisma"

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ["application/pdf"]

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file")
        const label = formData.get("label") || "My Resume"

        // Validation: File exists
        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded." },
                { status: 400 }
            )
        }

        // Validation: File type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Only PDF files are supported." },
                { status: 400 }
            )
        }

        // Validation: File size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large (Max 10MB)." },
                { status: 400 }
            )
        }

        // Convert to Buffer
        const buffer = Buffer.from(await file.arrayBuffer())

        // Extract text
        const text = await extractTextFromPDF(buffer)

        if (!text || text.trim().length < 100) {
            return NextResponse.json(
                { error: "Resume text too short or unreadable." },
                { status: 422 }
            )
        }

        // Save to DB
        const resume = await prisma.resume.create({
            data: {
                userId: session.user.id,
                label: label,
                extractedText: text,
            },
            select: {
                id: true,
                label: true,
                createdAt: true
            }
        })

        return NextResponse.json(resume)

    } catch (error) {
        console.error("Upload Error:", error)
        return NextResponse.json(
            { error: "Internal Server Error during upload" },
            { status: 500 }
        )
    }
}
