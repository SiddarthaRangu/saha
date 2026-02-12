import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
        }

        // Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email }
        })

        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create User
        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash: hashedPassword
            }
        })

        return NextResponse.json({
            user: { id: user.id, email: user.email }
        })

    } catch (error) {
        console.error("Register Error:", error)
        return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }
}
