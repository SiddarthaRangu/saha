"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { PiArrowRight } from "react-icons/pi"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/Card"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage("Account created successfully! Please sign in.")
        }
    }, [searchParams])

    async function onSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccessMessage("")

        const email = e.target.email.value
        const password = e.target.password.value

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Invalid email or password")
            setLoading(false)
        } else {
            router.push("/tracker") // Redirect to dashboard
        }
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
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">Welcome back</CardTitle>
                    <CardDescription className="text-secondary">Enter your email to sign in to your workspace.</CardDescription>
                </CardHeader>

                <form onSubmit={onSubmit}>
                    <CardContent className="space-y-6">
                        {successMessage && (
                            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm border border-emerald-500/20 animate-in fade-in slide-in-from-top-2 duration-300">
                                {successMessage}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1" htmlFor="email">
                                Email
                            </label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required disabled={loading} className="bg-white/5 border-border focus:ring-accent/20" />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary" htmlFor="password">
                                    Password
                                </label>
                            </div>
                            <Input id="password" name="password" type="password" required disabled={loading} className="bg-white/5 border-border focus:ring-accent/20" />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium border border-red-500/20">
                                {error}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex-col gap-6 pt-6 pb-8">
                        <Button type="submit" className="w-full h-12 shadow-lg shadow-accent/20 font-bold" isLoading={loading} disabled={loading}>
                            Sign In <PiArrowRight className="ml-2" />
                        </Button>

                        <p className="text-xs text-secondary text-center font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="text-accent hover:text-accent/80 font-bold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
