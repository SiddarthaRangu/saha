export default function ScoreGauge({ score, loading }) {
    if (loading) return <div className="animate-pulse h-32 w-32 rounded-full bg-white/5" />

    // Color logic
    const getColor = (s) => {
        if (s >= 80) return "text-accent-success"
        if (s >= 50) return "text-yellow-500"
        return "text-accent"
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className={`text-6xl font-mono font-bold tracking-tight ${getColor(score)}`}>
                {score}%
            </div>
            <span className="text-secondary text-xs font-sans mt-3 uppercase tracking-widest font-semibold opacity-80">
                Match Score
            </span>
        </div>
    )
}
