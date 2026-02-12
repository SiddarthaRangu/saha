"use client"
import { useState, useEffect } from "react"
import {
    PiUploadSimple, PiLightning, PiBriefcase, PiFileText,
    PiCheckCircle, PiTrash, PiSpinner, PiFilePdf,
    PiPlus
} from "react-icons/pi"
import { Button } from "@/components/ui/Button"
import GeneratorPanel from "@/components/features/content/GeneratorPanel"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"

export default function StandaloneGeneratorPage() {
    const [jd, setJd] = useState("")
    const [isStarted, setIsStarted] = useState(false)

    // Resume Management State
    const [resumes, setResumes] = useState([])
    const [selectedResumeId, setSelectedResumeId] = useState(null)
    const [loadingResumes, setLoadingResumes] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        fetchResumes()
    }, [])

    const fetchResumes = async () => {
        try {
            const res = await fetch("/api/resumes")
            const data = await res.json()
            if (data.resumes) {
                setResumes(data.resumes)
                if (data.resumes.length > 0 && !selectedResumeId) {
                    setSelectedResumeId(data.resumes[0].id)
                }
            }
        } catch (err) {
            console.error("Failed to fetch resumes")
        } finally {
            setLoadingResumes(false)
        }
    }

    const handleUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        setError("")

        const formData = new FormData()
        formData.append("file", file)
        formData.append("label", file.name.replace(".pdf", ""))

        try {
            const res = await fetch("/api/parse", {
                method: "POST",
                body: formData
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Upload failed")
            }

            const newResume = await res.json()
            setResumes([newResume, ...resumes])
            setSelectedResumeId(newResume.id)
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this resume?")) return

        try {
            const res = await fetch(`/api/resumes?id=${id}`, { method: "DELETE" })
            if (res.ok) {
                setResumes(resumes.filter(r => r.id !== id))
                if (selectedResumeId === id) {
                    setSelectedResumeId(resumes.length > 1 ? resumes.find(r => r.id !== id).id : null)
                }
            }
        } catch (err) {
            console.error("Delete failed")
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-mono text-3xl font-bold text-primary flex items-center gap-3">
                        Content Generator
                        <span className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-widest">
                            AI Writing
                        </span>
                    </h1>
                    <p className="text-secondary mt-1">
                        Create tailored cover letters and messages using your profile resumes.
                    </p>
                </div>
            </div>

            {!isStarted ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left: Resume Selection & Management */}
                    <div className="space-y-6">
                        <Card className="bg-surface border-border shadow-xl shadow-black/20 overflow-hidden">
                            <CardHeader className="border-b border-border bg-white/[0.02]">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-mono uppercase tracking-widest text-secondary flex items-center gap-2">
                                        <PiFileText className="text-accent" />
                                        Select Resume
                                    </CardTitle>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            disabled={uploading}
                                        />
                                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-wider border-accent/20 text-accent hover:bg-accent/5" disabled={uploading}>
                                            {uploading ? <PiSpinner className="animate-spin" /> : <PiPlus className="mr-1" />}
                                            Upload New
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {loadingResumes ? (
                                    <div className="p-12 text-center">
                                        <PiSpinner className="animate-spin text-3xl text-secondary mx-auto" />
                                    </div>
                                ) : resumes.length === 0 ? (
                                    <div className="p-12 text-center space-y-4">
                                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 border border-dashed border-border">
                                            <PiUploadSimple className="text-2xl text-secondary opacity-30" />
                                        </div>
                                        <p className="text-sm text-secondary italic">No resumes uploaded yet.</p>
                                    </div>
                                ) : (
                                    <div className="max-h-[300px] overflow-y-auto divide-y divide-border">
                                        {resumes.map((r) => (
                                            <div
                                                key={r.id}
                                                onClick={() => setSelectedResumeId(r.id)}
                                                className={`flex items-center justify-between p-4 cursor-pointer transition-all ${selectedResumeId === r.id
                                                        ? 'bg-accent/10 border-l-2 border-accent'
                                                        : 'hover:bg-white/5 border-l-2 border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`h-8 w-8 rounded flex items-center justify-center ${selectedResumeId === r.id ? 'bg-accent text-white' : 'bg-white/5 text-secondary'}`}>
                                                        <PiFilePdf className="text-lg" />
                                                    </div>
                                                    <div>
                                                        <p className={`text-sm font-medium ${selectedResumeId === r.id ? 'text-primary' : 'text-secondary'}`}>{r.label}</p>
                                                        <p className="text-[10px] font-mono text-secondary/50 uppercase">Added {new Date(r.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                                                    className="p-2 text-secondary hover:text-red-400 opacity-40 hover:opacity-100 transition-all"
                                                >
                                                    <PiTrash />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium animate-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="bg-white/5 p-6 rounded-2xl border border-dashed border-border space-y-3">
                            <h4 className="text-xs font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <PiCheckCircle className="text-emerald-500" /> Professional Fit
                            </h4>
                            <p className="text-xs text-secondary leading-relaxed">
                                We'll use the selected resume to extract your skills, experience, and tone to match the target job description.
                            </p>
                        </div>
                    </div>

                    {/* Right: Job Description Input */}
                    <Card className="bg-surface border-border shadow-2xl shadow-black/40">
                        <CardHeader>
                            <CardTitle className="text-sm font-mono uppercase tracking-widest text-secondary flex items-center gap-2">
                                <PiBriefcase className="text-accent" />
                                Target Job Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <textarea
                                className="w-full h-[320px] bg-white/5 border border-border rounded-xl p-4 text-sm text-primary placeholder:text-secondary/30 focus:ring-2 focus:ring-accent/20 outline-none resize-none transition-all"
                                placeholder="Paste the job requirements here..."
                                value={jd}
                                onChange={(e) => setJd(e.target.value)}
                            />
                            <Button
                                className="w-full h-14 shadow-lg shadow-accent/20 font-bold"
                                onClick={() => setIsStarted(true)}
                                disabled={!jd.trim() || !selectedResumeId}
                            >
                                <PiLightning className="mr-2" /> Start AI Writer
                            </Button>
                            {!selectedResumeId && (
                                <p className="text-[10px] text-center text-secondary/60 font-medium">Please upload or select a resume first</p>
                            )}
                        </CardContent>
                    </Card>

                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsStarted(false)}
                            className="text-[10px] font-mono font-bold uppercase tracking-widest border-white/10 hover:bg-white/5 h-10 px-4"
                        >
                            ← Back to Inputs
                        </Button>
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <PiFilePdf className="text-accent" />
                            <span className="text-xs font-medium text-primary">
                                {resumes.find(r => r.id === selectedResumeId)?.label}
                            </span>
                        </div>
                    </div>
                    <GeneratorPanel
                        jdText={jd}
                        resumeId={selectedResumeId} // We'll update GeneratorPanel to handle ID or Text
                        resumeText="FETCH_IN_PANEL"
                    />
                </div>
            )}
        </div>
    )
}
