import { PiWarningCircle, PiCheckCircle, PiTrendUp } from "react-icons/pi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import ScoreGauge from "./ScoreGauge"

export default function AnalysisResult({ analysis }) {
    if (!analysis) return null;
    const { matchScore, missingKeywords, improvementSuggestions, executiveSummary } = analysis;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* 1. Dashboard Row: Score + Verdict */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Score Card */}
                <Card className="md:col-span-1 border-accent/10 bg-surface shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-success group-hover:h-1.5 transition-all" />
                    <CardContent className="pt-8 flex flex-col items-center justify-center h-full min-h-[180px]">
                        <ScoreGauge score={matchScore} />
                    </CardContent>
                </Card>

                {/* Executive Summary Card */}
                <Card className="md:col-span-2 border-border bg-surface shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-mono uppercase tracking-wider text-secondary flex items-center gap-2">
                            <PiTrendUp className="text-xl text-accent" />
                            Executive Verdict
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-primary font-sans leading-relaxed">
                            {executiveSummary}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 2. Critical Gaps (Missing Keywords) */}
                {missingKeywords?.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="font-mono text-sm font-bold text-primary flex items-center gap-2">
                            <PiWarningCircle className="text-accent text-lg" />
                            Missing Skills & Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {missingKeywords.map((keyword, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium flex items-center gap-2 select-all hover:bg-red-500/20 transition-colors"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    {keyword}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-secondary italic">
                            *ATS Tip: Add these exactly as written to your "Skills" section.
                        </p>
                    </div>
                )}

                {/* 3. Action Plan (Improvements) */}
                <div className="space-y-4">
                    <h3 className="font-mono text-sm font-bold text-primary flex items-center gap-2">
                        <PiCheckCircle className="text-accent-success text-lg" />
                        Recommended Fixes
                    </h3>
                    <div className="space-y-3">
                        {improvementSuggestions?.length > 0 ? (
                            improvementSuggestions.map((tip, i) => (
                                <div key={i} className="group p-4 rounded-xl border border-border bg-white/5 hover:border-accent/30 transition-all flex gap-3 items-start">
                                    <div className="mt-0.5 min-w-[20px] text-secondary group-hover:text-accent font-mono text-xs font-bold">
                                        {i + 1}.
                                    </div>
                                    <p className="text-primary text-sm leading-relaxed">{tip}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-secondary text-sm italic">No specific improvements suggested for this match.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
