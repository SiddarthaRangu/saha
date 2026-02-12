"use client"
import { useState, useEffect, use } from "react"
import {
    PiBriefcase, PiBuildings, PiArrowLeft, PiLightning,
    PiFileText, PiCheckCircle, PiWarningCircle, PiSpinner,
    PiCaretRight, PiTarget
} from "react-icons/pi"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card"
import Link from "next/link"
import GeneratorPanel from "@/components/features/content/GeneratorPanel"
import ScoreGauge from "@/components/features/analysis/ScoreGauge"
import AnalysisResult from "@/components/features/analysis/AnalysisResult"

export default function JobDetailsPage({ params }) {
    const { id } = use(params);
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("overview") // overview, analysis, content, preparation

    // Analysis State
    const [analyzing, setAnalyzing] = useState(false)
    const [analysisResult, setAnalysisResult] = useState(null)

    // Preparation State
    const [preparing, setPreparing] = useState(false)
    const [prepPlan, setPrepPlan] = useState(null)

    useEffect(() => {
        fetchJob()
    }, [id])

    const fetchJob = async () => {
        try {
            const res = await fetch(`/api/jobs`) // User's API returns all jobs, I'll filter here for simplicity or if the user has a single fetch route
            const data = await res.json()
            const foundJob = data.jobs?.find(j => j.id === id)
            if (!foundJob) throw new Error("Job not found")
            setJob(foundJob)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const runAnalysis = async () => {
        setAnalyzing(true)
        setError("")
        try {
            // We need a resume. Usually users should have a master resume.
            // For now, if no resume is found in DB, we might need them to upload one in the general analysis page.
            // But let's check if we can fetch user's last resume.
            const resumeRes = await fetch("/api/parse/list"); // Assume this exists or I'll need to check
            // Actually, let's just use the general analysis endpoint pattern but with stored JD.
            // For MVP within Phase 1-3, I'll assume they might need to go to the Analysis page if they haven't uploaded.
            // But if I want to be proactive, I should fetch the resume from the DB.

            const res = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jdText: job.jdText,
                    resumeText: "FETCH_FROM_DB", // I'll update the API to handle this or fetch it here
                })
            })
            const data = await res.json()
            setAnalysisResult(data)
            setActiveTab("analysis")
        } catch (err) {
            setError("Failed to run analysis")
        } finally {
            setAnalyzing(false)
        }
    }

    const runPrep = async () => {
        setPreparing(true)
        try {
            const res = await fetch("/api/ai/preparation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: job.companyName,
                    roleTitle: job.roleTitle,
                    jdText: job.jdText
                })
            })
            const data = await res.json()
            setPrepPlan(data)
            setActiveTab("preparation")
        } catch (err) {
            setError("Failed to generate preparation plan")
        } finally {
            setPreparing(false)
        }
    }

    if (loading) return <div className="p-12 text-center animate-pulse font-mono">Loading job details...</div>
    if (error) return (
        <div className="p-12 text-center space-y-4">
            <PiWarningCircle className="mx-auto text-4xl text-red-500" />
            <p className="text-secondary">{error}</p>
            <Link href="/tracker">
                <Button variant="outline">Back to Tracker</Button>
            </Link>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Breadcrumbs & Back */}
            <Link href="/tracker" className="flex items-center gap-2 text-secondary hover:text-accent transition-colors text-sm font-medium group">
                <PiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Application Tracker
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-surface p-8 rounded-2xl border border-border shadow-sm shadow-black/20">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <PiBuildings className="text-3xl text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-primary tracking-tight">{job.companyName}</h1>
                            <p className="flex items-center gap-2 text-secondary font-medium mt-1">
                                <PiBriefcase className="text-accent" /> {job.roleTitle}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={runAnalysis} disabled={analyzing} className="gap-2 border-white/10 hover:bg-white/5">
                        {analyzing ? <PiSpinner className="animate-spin" /> : <PiLightning className="text-accent" />}
                        Quick Match
                    </Button>
                    <Button variant="outline" onClick={runPrep} disabled={preparing} className="gap-2 border-white/10 hover:bg-white/5">
                        {preparing ? <PiSpinner className="animate-spin" /> : <PiTarget className="text-emerald-500" />}
                        Prep Guide
                    </Button>
                    <Button onClick={() => setActiveTab("content")} className="gap-2 shadow-lg shadow-accent/20">
                        <PiFileText /> Generate Content
                    </Button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-8 border-b border-border px-4">
                {[
                    { id: 'overview', label: 'Job Overview' },
                    { id: 'analysis', label: 'Match Analysis' },
                    { id: 'content', label: 'Content Generator' },
                    { id: 'preparation', label: 'Interview Prep' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 text-xs font-bold font-mono uppercase tracking-[0.2em] transition-all relative ${activeTab === tab.id ? 'text-primary opacity-100' : 'text-secondary hover:text-primary opacity-60'
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-t-full shadow-[0_0_12px_rgba(231,111,81,0.6)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-surface border-border">
                                <CardHeader>
                                    <CardTitle className="text-sm font-mono uppercase tracking-wider text-secondary">Job Description</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-invert prose-sm max-w-none text-secondary whitespace-pre-wrap leading-relaxed">
                                        {job.jdText || "No job description provided."}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card className="bg-surface border-border">
                                <CardHeader>
                                    <CardTitle className="text-sm font-mono uppercase tracking-wider text-secondary">Application Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-sm text-secondary">Status</span>
                                        <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider">{job.status}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-sm text-secondary">Added on</span>
                                        <span className="text-sm font-mono text-primary">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm text-secondary">Last Update</span>
                                        <span className="text-sm font-mono text-primary">{new Date(job.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {analysisResult ? (
                            <AnalysisResult analysis={analysisResult} />
                        ) : (
                            <div className="bg-surface p-16 rounded-2xl border border-dashed border-border text-center space-y-6">
                                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                    <PiLightning className="text-5xl text-accent/30" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono text-xl font-bold text-primary uppercase tracking-tight">Ready to analyze?</h3>
                                    <p className="text-secondary max-w-md mx-auto text-sm">
                                        We'll compare your latest uploaded resume against this job description to find gaps.
                                    </p>
                                </div>
                                <Button onClick={runAnalysis} disabled={analyzing} size="lg" className="px-8 shadow-lg shadow-accent/10">
                                    {analyzing ? "Analyzing..." : "Run Analysis Now"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <GeneratorPanel
                            applicationId={job.id}
                            jdText={job.jdText}
                            resumeText={"RESUME_TEXT_PLACEHOLDER"}
                        />
                    </div>
                )}

                {activeTab === 'preparation' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {prepPlan ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="md:col-span-1 bg-surface border-border">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-mono uppercase tracking-widest text-secondary">Key Topics</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 pt-2">
                                            {prepPlan.keyTopics?.map((topic, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-primary font-medium group">
                                                    <span className="text-accent group-hover:scale-125 transition-transform flex-shrink-0">•</span> {topic}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                                <Card className="md:col-span-2 bg-surface border-border">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-mono uppercase tracking-widest text-secondary">Interview Questions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-2">
                                        <div className="space-y-4">
                                            {prepPlan.likelyInterviewQuestions?.map((q, i) => (
                                                <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 border-l-4 border-l-accent hover:bg-white/10 transition-colors">
                                                    <p className="text-sm font-medium text-primary leading-relaxed italic">"{q}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="bg-surface p-16 rounded-2xl border border-dashed border-border text-center space-y-6">
                                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                    <PiTarget className="text-5xl text-emerald-500/30" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono text-xl font-bold text-primary uppercase tracking-tight">Prepare for the call</h3>
                                    <p className="text-secondary max-w-md mx-auto text-sm">
                                        Generate a custom preparation guide with likely questions and technical topics to review.
                                    </p>
                                </div>
                                <Button onClick={runPrep} disabled={preparing} variant="secondary" size="lg" className="px-8 border-white/10 bg-white/5 text-white hover:bg-white/10">
                                    {preparing ? "Generating..." : "Generate Prep Guide"}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
