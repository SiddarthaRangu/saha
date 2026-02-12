import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { createApplication, getUserApplications, updateStatus } from "@/services/trackerService"

// GET: List all jobs for the user
export async function GET(req) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const jobs = await getUserApplications(session.user.id)
    return NextResponse.json({ jobs })
}

// POST: Create a new job
export async function POST(req) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    // Validate basic data
    if (!data.companyName || !data.roleTitle) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newJob = await createApplication(session.user.id, data)
    return NextResponse.json(newJob)
}

// PUT: Update job status
export async function PUT(req) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status } = await req.json()

    try {
        const updatedJob = await updateStatus(id, session.user.id, status)
        return NextResponse.json(updatedJob)
    } catch (error) {
        // Falls here if ID doesn't exist or doesn't belong to user
        return NextResponse.json({ error: "Failed to update" }, { status: 403 })
    }
}
