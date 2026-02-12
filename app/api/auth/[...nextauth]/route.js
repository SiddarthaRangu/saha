import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid email or password")
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                })

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid email or password")
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

                if (!isValid) {
                    throw new Error("Invalid email or password")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
            }
            return session
        }
    },
    pages: {
        signIn: '/auth/login',
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
