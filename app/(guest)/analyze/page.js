"use client"
import { useState } from "react"
import Link from "next/link"
import { PiUploadSimple, PiLightning, PiFilePdf, PiCheckCircle, PiArrowRight, PiShieldCheck } from "react-icons/pi"
import { Button } from "@/components/ui/Button"

export default function GuestAnalyzePage() {
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
                })
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
        <div className="min-h-screen bg-[#0E0E11] text-white">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <PiShieldCheck className="text-[#E76F51]" />
                        <span className="text-xs font-mono font-medium text-gray-400">
                            No Login Required • 100% Private
                        </span>
                    </div>

                    <h1 className="font-mono text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
                        Quick Resume Analysis
                    </h1>

                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        Upload your resume and a job description to get instant AI-powered feedback on your match score and missing keywords.
                    </p>
                </section>

                {/* Analysis Form */}
                <section className="px-4 pb-20 max-w-5xl mx-auto">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Resume Upload */}
                            <div className="bg-black/20 p-6 rounded-xl border border-dashed border-white/10 hover:border-[#E76F51]/50 transition-colors flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
                                <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center">
                                    {file ? <PiFilePdf className="text-2xl text-red-400" /> : <PiUploadSimple className="text-2xl text-gray-400" />}
                                </div>

                                <div>
                                    <h3 className="font-mono font-bold text-white">
                                        {file ? file.name : "Upload Resume"}
                                    </h3>
                                    <p className="text-sm text-gray-400 mt-1">
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
                                    <Button
                                        variant={file ? "secondary" : "primary"}
                                        size="sm"
                                        className={file ? "bg-white/10 text-white border-white/20" : ""}
                                    >
                                        {file ? "Change File" : "Select PDF"}
                                    </Button>
                                </div>
                            </div>

                            {/* JD Text Area */}
                            <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex flex-col">
                                <label className="text-xs font-mono font-bold uppercase text-gray-400 mb-2 tracking-wide">
                                    Target Job Description
                                </label>
                                <textarea
                                    className="flex-1 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#E76F51]/20 outline-none resize-none min-h-[160px]"
                                    placeholder="Paste the full job description here..."
                                    value={jd}
                                    onChange={(e) => setJd(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center mb-6">
                                {error}
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                onClick={handleAnalyze}
                                disabled={loading || !file || !jd}
                                className="w-full md:w-auto min-w-[200px] bg-[#E76F51] hover:bg-[#D05D40] text-white border-none h-14 px-8 text-lg shadow-[0_0_20px_rgba(231,111,81,0.3)] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                isLoading={loading}
                            >
                                {!loading && <PiLightning className="mr-2" />}
                                {loading ? "Analyzing..." : "Run Analysis"}
                            </Button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {result && (
                        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <PiCheckCircle className="text-3xl text-green-400" />
                                <h2 className="font-mono text-2xl font-bold">Analysis Complete</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Match Score */}
                                <div>
                                    <h3 className="text-sm font-mono uppercase text-gray-400 mb-2">Match Score</h3>
                                    <div className="text-5xl font-bold font-mono text-[#E76F51]">
                                        {result.matchScore || result.score || "N/A"}%
                                    </div>
                                </div>

                                {/* Missing Keywords */}
                                {result.missingKeywords && result.missingKeywords.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-mono uppercase text-gray-400 mb-3">Missing Keywords</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missingKeywords.map((keyword, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full text-sm font-mono"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Summary */}
                                {result.summary && (
                                    <div>
                                        <h3 className="text-sm font-mono uppercase text-gray-400 mb-3">Summary</h3>
                                        <p className="text-gray-300 leading-relaxed">{result.summary}</p>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-gray-400 mb-4">
                                        Want to save this analysis and track your applications?
                                    </p>
                                    <Link href="/auth/register">
                                        <Button className="bg-white text-black hover:bg-gray-200 border-none">
                                            Create Free Account <PiArrowRight className="ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Footer CTA */}
                {!result && (
                    <section className="px-4 pb-20 text-center max-w-2xl mx-auto">
                        <p className="text-gray-500 text-sm mb-4">
                            This is a guest feature. For full access to job tracking and saved analyses,
                        </p>
                        <Link href="/auth/register">
                            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                                Create a Free Account
                            </Button>
                        </Link>
                    </section>
                )}
            </div>
        </div>
    )
}
