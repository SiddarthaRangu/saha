"use client"
import { useState } from "react"
import { useCompletion } from "@ai-sdk/react"
import { PiCopy, PiPenNib, PiLightning, PiCheckCircle, PiFileText } from "react-icons/pi"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export default function GeneratorPanel({ resumeText, jdText, applicationId, resumeId }) {
    const [activeType, setActiveType] = useState(null);
    const { complete, completion, isLoading } = useCompletion({
        api: '/api/ai/generate',
        body: {
            applicationId, // To save it to DB if needed
            resumeId,      // To use a specific resume
        }
    })

    const handleGenerate = (type) => {
        setActiveType(type);
        complete("", { body: { type, resumeText, jdText, applicationId, resumeId } });
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(completion);
    }

    const types = [
        { id: 'COVER_LETTER', label: 'Cover Letter', icon: <PiFileText /> },
        { id: 'LINKEDIN_MESSAGE', label: 'LinkedIn Message', icon: <PiPenNib /> },
        { id: 'COLD_EMAIL', label: 'Cold Email', icon: <PiLightning /> },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-stretch animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Control Panel */}
            <div className="space-y-6">
                <div className="bg-surface p-8 rounded-2xl border border-border shadow-md space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                            <PiPenNib className="text-xl" />
                        </div>
                        <h3 className="font-mono text-lg font-bold text-primary uppercase tracking-tight">
                            Content Writer
                        </h3>
                    </div>
                    <p className="text-sm text-secondary leading-relaxed">
                        Generate tailored outreach materials using your resume and this job description.
                    </p>

                    <div className="flex flex-col gap-3 pt-4">
                        {types.map((t) => (
                            <Button
                                key={t.id}
                                onClick={() => handleGenerate(t.id)}
                                disabled={isLoading || !resumeText || !jdText}
                                variant={activeType === t.id ? "primary" : "outline"}
                                className="w-full justify-start gap-4 h-14 text-sm font-medium transition-all group"
                            >
                                <span className={activeType === t.id ? "text-white" : "text-accent group-hover:scale-110 transition-transform"}>
                                    {t.icon}
                                </span>
                                {t.label}
                                {activeType === t.id && isLoading && (
                                    <span className="ml-auto animate-pulse text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">Writing...</span>
                                )}
                            </Button>
                        ))}
                    </div>

                    {!jdText && (
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-xs text-orange-400 mt-6 flex gap-3">
                            <PiLightning className="flex-shrink-0 text-lg" />
                            <span>Missing Job Description. Please add a JD in the Overview tab to enable generation.</span>
                        </div>
                    )}
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-dashed border-white/10 italic text-xs text-secondary leading-relaxed flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(231,111,81,0.6)] flex-shrink-0" />
                    Tip: The AI works best when the JD includes specific requirements and the resume has relevant experience.
                </div>
            </div>

            {/* Output Panel (Streaming Area) */}
            <div className="bg-surface rounded-2xl border border-border flex flex-col min-h-[500px] shadow-xl shadow-black/20 overflow-hidden group">
                <div className="px-6 py-4 border-b border-border bg-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary">
                        Generated Output
                    </span>
                    {completion && !isLoading && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-2 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 border border-white/10"
                            onClick={copyToClipboard}
                        >
                            <PiCopy /> Copy Result
                        </Button>
                    )}
                </div>

                <div className="flex-1 p-8 relative overflow-y-auto max-h-[600px] prose prose-invert prose-sm prose-slate max-w-none">
                    {completion ? (
                        <div className="font-sans text-primary whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500 selection:bg-accent selection:text-white">
                            {completion}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-24 select-none">
                            <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                <PiPenNib className="text-5xl text-gray-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-mono text-sm font-bold uppercase tracking-tight text-primary">Awaiting Selection</p>
                                <p className="max-w-[200px] text-xs italic text-secondary">
                                    Select a content type on the left to start the AI writer.
                                </p>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-accent mt-8 animate-pulse border-t border-white/5 pt-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">Writing Content...</span>
                        </div>
                    )}
                </div>

                {completion && !isLoading && (
                    <div className="px-6 py-4 bg-emerald-500/10 border-t border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        <PiCheckCircle className="text-sm" /> Content fully generated. Always review AI output before sending.
                    </div>
                )}
            </div>
        </div>
    )
}
