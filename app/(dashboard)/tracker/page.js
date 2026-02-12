"use client"
import { useState, useEffect } from "react"
import { PiPlus, PiBriefcase, PiBuildings, PiCalendarBlank, PiCaretRight } from "react-icons/pi"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { twMerge } from "tailwind-merge"
import { clsx } from "clsx"

export default function TrackerPage() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const [error, setError] = useState("")
    const [newJob, setNewJob] = useState({ companyName: "", roleTitle: "", jdText: "" })

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
            setError("Failed to load applications. Please refresh the page.")
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newJob)
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to create job")
            }

            const job = await res.json()
            setJobs([job, ...jobs])
            setShowAdd(false)
            setNewJob({ companyName: "", roleTitle: "", jdText: "" })
        } catch (err) {
            console.error(err)
            setError(err.message || "Failed to add job. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const cycleStatus = async (id, currentStatus) => {
        const statuses = ["BOOKMARKED", "APPLIED", "INTERVIEWING", "OFFERED", "REJECTED"]
        const idx = statuses.indexOf(currentStatus)
        const nextStatus = statuses[(idx + 1) % statuses.length]

        // Optimistic update
        const oldJobs = [...jobs]
        setJobs(jobs.map(j => j.id === id ? { ...j, status: nextStatus } : j))

        try {
            const res = await fetch("/api/jobs", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: nextStatus })
            })

            if (!res.ok) throw new Error("Failed to update status")
        } catch (err) {
            console.error(err)
            // Revert on error
            setJobs(oldJobs)
            setError("Failed to update status. Please try again.")
            setTimeout(() => setError(""), 3000)
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-mono text-3xl font-bold text-primary flex items-center gap-3">
                        Job Tracker
                        <span className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-widest">
                            Pipeline
                        </span>
                    </h1>
                    <p className="text-secondary mt-1">Manage and track your active job search applications.</p>
                </div>
                <Button onClick={() => setShowAdd(!showAdd)} className="h-12 px-6 shadow-xl shadow-accent/20 font-bold group">
                    <PiPlus className="mr-2 group-hover:rotate-90 transition-transform" /> Add New Opportunity
                </Button>
            </div>

            {/* Global Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Add New Job Form (Collapsible) */}
            {showAdd && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                    <Card className="border-accent/20 shadow-2xl shadow-black/40 bg-surface">
                        <CardHeader>
                            <CardTitle className="text-primary font-mono text-sm uppercase tracking-wider">Track New Application</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleCreate}>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1">Company Name</label>
                                        <Input
                                            placeholder="e.g. Acme Corp"
                                            required
                                            value={newJob.companyName}
                                            onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                                            className="h-12 bg-white/5 border-border text-primary focus:ring-accent/20"
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1">Role Title</label>
                                        <Input
                                            placeholder="e.g. Senior Product Engineer"
                                            required
                                            value={newJob.roleTitle}
                                            onChange={(e) => setNewJob({ ...newJob, roleTitle: e.target.value })}
                                            className="h-12 bg-white/5 border-border text-primary focus:ring-accent/20"
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold uppercase tracking-widest text-secondary ml-1">Job Description (Optional)</label>
                                    <textarea
                                        className="flex min-h-[160px] w-full rounded-xl border border-border bg-white/5 px-4 py-3 text-sm text-primary placeholder:text-secondary/30 focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
                                        placeholder="Paste the full job description here. This will be used for AI analysis later."
                                        value={newJob.jdText}
                                        onChange={(e) => setNewJob({ ...newJob, jdText: e.target.value })}
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="pt-2 flex justify-end gap-3">
                                    <Button
                                        variant="ghost"
                                        type="button"
                                        onClick={() => {
                                            setShowAdd(false)
                                            setNewJob({ companyName: "", roleTitle: "", jdText: "" })
                                            setError("")
                                        }}
                                        disabled={submitting}
                                        className="text-secondary hover:text-primary hover:bg-white/5 border border-white/5"
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" isLoading={submitting} disabled={submitting} className="px-8 shadow-lg shadow-accent/20">
                                        Save Opportunity
                                    </Button>
                                </div>
                            </CardContent>
                        </form>
                    </Card>
                </div>
            )}

            {/* Main Content List */}
            <div className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm shadow-black/20">
                        <p className="text-[10px] text-secondary font-mono font-black uppercase tracking-widest mb-1">Total</p>
                        <p className="text-2xl font-bold font-mono text-primary">{jobs.length}</p>
                    </div>
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm shadow-black/20">
                        <p className="text-[10px] text-secondary font-mono font-black uppercase tracking-widest mb-1">Active</p>
                        <p className="text-2xl font-bold font-mono text-accent">
                            {jobs.filter(j => j.status === 'APPLIED' || j.status === 'INTERVIEWING').length}
                        </p>
                    </div>
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm shadow-black/20">
                        <p className="text-[10px] text-secondary font-mono font-black uppercase tracking-widest mb-1">Upcoming</p>
                        <p className="text-2xl font-bold font-mono text-emerald-400">
                            {jobs.filter(j => j.status === 'INTERVIEWING' || j.status === 'OFFERED').length}
                        </p>
                    </div>
                    <div className="bg-surface p-5 rounded-2xl border border-border shadow-sm shadow-black/20">
                        <p className="text-[10px] text-secondary font-mono font-black uppercase tracking-widest mb-1">Success</p>
                        <p className="text-2xl font-bold font-mono text-emerald-500">
                            {jobs.filter(j => j.status === 'OFFERED').length}
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-24 bg-surface border border-border rounded-2xl shadow-xl shadow-black/20">
                        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse border border-white/5">
                            <PiBriefcase className="text-3xl text-secondary" />
                        </div>
                        <h3 className="font-mono font-bold text-lg text-primary uppercase tracking-tight">Scanning Pipeline...</h3>
                    </div>
                )}

                {/* Empty State */}
                {!loading && jobs.length === 0 && (
                    <div className="text-center py-24 bg-surface border border-dashed border-border rounded-xl shadow-inner">
                        <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <PiBriefcase className="text-3xl text-secondary opacity-40" />
                        </div>
                        <h3 className="font-mono font-bold text-lg text-primary uppercase tracking-tight">No applications yet</h3>
                        <p className="text-secondary max-w-sm mx-auto mt-2 mb-8 text-sm leading-relaxed">
                            Your job search pipeline is currently empty. Start tracking opportunities to unlock insights.
                        </p>
                        <Button onClick={() => setShowAdd(true)} size="lg" className="px-10 shadow-xl shadow-accent/20">
                            Track Your First Role
                        </Button>
                    </div>
                )}

                {/* Job List */}
                {!loading && jobs.length > 0 && (
                    <div className="grid gap-4">
                        {jobs.map((job) => (
                            <div key={job.id} className="group bg-surface p-6 rounded-2xl border border-border hover:border-accent/40 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                                {/* Left: Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/20 transition-all">
                                            <PiBuildings className="text-xl text-secondary group-hover:text-accent" />
                                        </div>
                                        <h3 className="font-bold text-xl text-primary group-hover:text-accent transition-colors">{job.companyName}</h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-5 text-sm text-secondary pl-14">
                                        <span className="flex items-center gap-2 font-medium">
                                            <PiBriefcase className="text-accent/60" /> {job.roleTitle}
                                        </span>
                                        <span className="hidden md:inline h-1 w-1 rounded-full bg-white/20" />
                                        <span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest">
                                            <PiCalendarBlank className="text-accent/60" /> Updated {new Date(job.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t border-white/5 md:border-t-0 pt-6 md:pt-0 mt-2 md:mt-0">
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] uppercase font-bold text-secondary font-mono tracking-[0.2em]">Application Status</span>
                                        <StatusBadge status={job.status} onClick={() => cycleStatus(job.id, job.status)} />
                                    </div>
                                    <Link href={`/tracker/${job.id}`}>
                                        <Button variant="ghost" size="sm" className="h-12 px-6 gap-3 group/btn hover:bg-white/5 border border-white/5 font-mono text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary">
                                            View Details <PiCaretRight className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function StatusBadge({ status, onClick }) {
    const styles = {
        BOOKMARKED: "bg-white/5 text-gray-400 border-white/10",
        APPLIED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        INTERVIEWING: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        OFFERED: "bg-green-500/10 text-green-400 border-green-500/20",
        REJECTED: "bg-red-500/10 text-red-400 border-red-500/20 line-through opacity-70"
    }

    return (
        <button
            onClick={onClick}
            className={twMerge(clsx(
                "px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wide cursor-pointer select-none border transition-all hover:scale-105 active:scale-95",
                styles[status] || styles.BOOKMARKED
            ))}
        >
            {status}
        </button>
    )
}
