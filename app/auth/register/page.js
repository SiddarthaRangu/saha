"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PiArrowRight, PiCheckCircle } from "react-icons/pi"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/Card"

export default function RegisterPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    async function onSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const name = e.target.name.value
        const email = e.target.email.value
        const password = e.target.password.value
        const confirmPassword = e.target.confirmPassword.value

        // Client-side validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address")
            setLoading(false)
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to register")
            }

            // Success
            setSuccess(true)
            setTimeout(() => {
                router.push("/auth/login?registered=true")
            }, 2000)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md bg-surface border-border text-center shadow-2xl shadow-black/40">
                    <CardContent className="pt-16 pb-16 space-y-6">
                        <div className="h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                            <PiCheckCircle className="text-5xl text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="font-mono text-2xl font-bold text-primary uppercase tracking-tighter">Account Created!</h2>
                            <p className="text-secondary text-sm">
                                Redirecting you to the workspace gateway...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Link href="/" className="mb-12 flex items-center gap-3 group">
                <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-110 transition-transform">
                    <span className="text-white font-mono font-black text-xl italic">S</span>
                </div>
                <span className="font-mono font-bold text-2xl tracking-tighter text-primary">SAHA</span>
            </Link>

            <Card className="w-full max-w-md bg-surface border-border shadow-2xl shadow-black/40">
                <CardHeader className="space-y-1 pb-8">
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">Create account</CardTitle>
                    <CardDescription className="text-secondary">Get started with your personalized job tracker.</CardDescription>
                </CardHeader>

                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1" htmlFor="name">Full Name</label>
                            <Input id="name" name="name" type="text" placeholder="Jane Doe" required disabled={loading} className="bg-white/5 border-border focus:ring-accent/20" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1" htmlFor="email">Email</label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} className="bg-white/5 border-border focus:ring-accent/20" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1" htmlFor="password">Password</label>
                            <Input id="password" name="password" type="password" placeholder="Min. 8 characters" required disabled={loading} minLength={8} className="bg-white/5 border-border focus:ring-accent/20" />
                            <p className="text-[10px] text-secondary/50 font-medium ml-1">Must be at least 8 characters</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1" htmlFor="confirmPassword">Confirm Password</label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter password" required disabled={loading} minLength={8} className="bg-white/5 border-border focus:ring-accent/20" />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium border border-red-500/20">
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col gap-6 pt-6 pb-8">
                        <Button type="submit" className="w-full h-12 shadow-lg shadow-accent/20 font-bold" isLoading={loading} disabled={loading}>
                            Create Account <PiArrowRight className="ml-2" />
                        </Button>

                        <p className="text-xs text-secondary text-center font-medium">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-accent hover:text-accent/80 font-bold transition-colors">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
