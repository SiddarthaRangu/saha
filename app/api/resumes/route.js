import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const resumes = await prisma.resume.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                label: true,
                createdAt: true
            }
        })

        return NextResponse.json({ resumes })
    } catch (error) {
        console.error("Failed to fetch resumes:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const resumeId = searchParams.get("id")

        if (!resumeId) {
            return NextResponse.json({ error: "Missing resume ID" }, { status: 400 })
        }

        const resume = await prisma.resume.findFirst({
            where: { id: resumeId, userId: session.user.id }
        })

        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 })
        }

        await prisma.resume.delete({
            where: { id: resumeId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Failed to delete resume:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
