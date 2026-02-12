"use client"
import { useState } from "react"
import { PiUploadSimple, PiLightning, PiFilePdf, PiCheckCircle } from "react-icons/pi"
import { Button } from "@/components/ui/Button"
import AnalysisResult from "@/components/features/analysis/AnalysisResult"
import { clsx } from "clsx"

export default function AnalysisPage() {
    const [file, setFile] = useState(null)
    const [jd, setJd] = useState("")
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleAnalyze = async () => {
        if (!file || !jd) {
            setError("Please upload a resume and paste a job description.")
            return
        }

        setLoading(true)
        setError("")
        setResult(null)

        try {
            // Step 1: Parse PDF
            const formData = new FormData()
            formData.append("file", file)

            const parseRes = await fetch("/api/parse", {
                method: "POST",
                body: formData
            })

            if (!parseRes.ok) {
                const errorData = await parseRes.json()
                throw new Error(errorData.error || "Failed to read resume PDF")
            }
            const { text: resumeText } = await parseRes.json()

            // Step 2: Analyze with AI
            const analyzeRes = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText,
                    jdText: jd
                }) // userId is optional/handled by session if needed later
            })

            if (!analyzeRes.ok) {
                const errorData = await analyzeRes.json()
                throw new Error(errorData.error || "Analysis failed. Please try again.")
            }
            const data = await analyzeRes.json()

            setResult(data)

        } catch (err) {
            console.error(err)
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="font-mono text-3xl font-bold text-primary flex items-center gap-3">
                    Resume Analysis
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-full flex items-center gap-1 font-sans font-medium">
                        <PiCheckCircle /> Online
                    </span>
                </h1>
                <p className="text-secondary mt-1">
                    Upload your resume and a JD to detect critical keyword gaps.
                </p>
            </div>

            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Resume Upload */}
                <div className="bg-surface p-6 rounded-xl border border-dashed border-border hover:border-accent/30 transition-colors flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                    <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center">
                        {file ? <PiFilePdf className="text-2xl text-red-400" /> : <PiUploadSimple className="text-2xl text-secondary" />}
                    </div>

                    <div>
                        <h3 className="font-mono font-bold text-primary">
                            {file ? file.name : "Upload Resume"}
                        </h3>
                        <p className="text-sm text-secondary mt-1">
                            {file ? `${(file.size / 1024).toFixed(0)} KB` : "PDF format only"}
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button variant={file ? "outline" : "primary"} size="sm">
                            {file ? "Change File" : "Select PDF"}
                        </Button>
                    </div>
                </div>

                {/* 2. JD Text Area */}
                <div className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col">
                    <label className="text-xs font-mono font-bold uppercase text-secondary mb-2 tracking-wide">
                        Target Job Description
                    </label>
                    <textarea
                        className="flex-1 w-full bg-white/5 border-0 rounded-lg p-3 text-sm text-primary placeholder:text-secondary/50 focus:ring-2 focus:ring-accent/20 outline-none resize-none min-h-[160px]"
                        placeholder="Paste the full job description here..."
                        value={jd}
                        onChange={(e) => setJd(e.target.value)}
                    />
                </div>
            </div>

            {/* Action Area */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={loading || !file || !jd}
                    className="w-full md:w-auto min-w-[200px] shadow-xl shadow-accent/20"
                    isLoading={loading}
                >
                    {!loading && <PiLightning className="mr-2" />}
                    {loading ? "Analyzing..." : "Run Analysis"}
                </Button>
            </div>

            {/* Results Section */}
            {result && (
                <div className="pt-8 border-t border-border">
                    <AnalysisResult analysis={result} />
                </div>
            )}
        </div>
    )
}
