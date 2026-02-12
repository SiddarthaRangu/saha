"use client"
import { useState, useEffect } from "react"
import {
    PiTarget, PiBriefcase, PiBuildings, PiCaretRight,
    PiSpinner, PiCheckCircle, PiWarningCircle
} from "react-icons/pi"
import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function PreparationPage() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/jobs")
            if (!res.ok) throw new Error("Failed to fetch jobs")
            const data = await res.json()
            if (data.jobs) setJobs(data.jobs)
        } catch (err) {
            console.error(err)
            setError("Failed to load applications.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="font-mono text-3xl font-bold text-primary">
                    Interview Preparation
                </h1>
                <p className="text-secondary mt-1">
                    Select an application to generate a tailored preparation guide.
                </p>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse font-mono text-secondary italic">Loading your applications...</div>
            ) : jobs.length === 0 ? (
                <div className="border border-border rounded-xl bg-surface p-12 text-center space-y-4 shadow-sm shadow-black/20">
                    <PiBriefcase className="mx-auto text-4xl text-white/10" />
                    <h3 className="font-mono text-xl font-bold text-primary uppercase tracking-tight">No applications tracked yet</h3>
                    <p className="text-secondary">You need to track a job first to generate a prep guide.</p>
                    <Link href="/tracker">
                        <Button className="shadow-lg shadow-accent/20">Go to Tracker</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <Link key={job.id} href={`/tracker/${job.id}`}>
                            <div className="group bg-surface p-6 rounded-xl border border-border hover:border-accent/30 hover:shadow-lg hover:shadow-black/40 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl text-secondary group-hover:text-accent group-hover:bg-white/10 transition-all border border-white/5">
                                        <PiBuildings />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-primary group-hover:text-accent transition-colors">{job.companyName}</h3>
                                        <p className="text-sm text-secondary flex items-center gap-1.5 mt-1">
                                            <PiBriefcase className="text-xs" /> {job.roleTitle}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="gap-2 font-mono uppercase tracking-widest text-[10px] font-bold text-secondary group-hover:text-primary">
                                    Prepare <PiCaretRight className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
