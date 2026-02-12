import Link from "next/link"
import { PiArrowRight, PiLightning, PiCheckCircle, PiShieldCheck, PiBriefcase, PiChartLine } from "react-icons/pi"
import { Button } from "@/components/ui/Button"

export default function LandingPage() {
    return (
        // Force Dark Theme for Landing Page specific look (SaaS Style)
        <div className="min-h-screen bg-[#0E0E11] text-[#F9FAFB] font-sans selection:bg-[#E76F51] selection:text-white">

            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-[#E76F51] animate-pulse shadow-[0_0_10px_#E76F51]" />
                        <span className="text-xs font-mono font-medium text-gray-400">
                            v1.0 Public Beta
                        </span>
                    </div>

                    {/* H1 */}
                    <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                        We handle applications.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">
                            You focus on preparation.
                        </span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                        SAHA is the missing workflow layer for your job search.
                        Analyze matches, track applications, and manage content in one focused, distraction-free workspace.
                    </p>

                    {/* CTA Group */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                        <Link href="/auth/register">
                            <Button size="lg" className="bg-[#E76F51] hover:bg-[#D05D40] text-white border-none h-14 px-8 text-lg shadow-[0_0_20px_rgba(231,111,81,0.3)] transition-all hover:scale-105">
                                Start Tracking Free <PiArrowRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link href="/analyze">
                            <Button size="lg" className="bg-white/5 text-white border border-white/10 hover:bg-white/10 h-14 px-8 text-lg backdrop-blur-sm">
                                <PiLightning className="mr-2 text-[#E76F51]" />
                                Try Without Login
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Visual Preview / Grid */}
                <section className="py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Card 1 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E76F51]/50 transition-colors group">
                                <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl text-[#E76F51] mb-6 group-hover:scale-110 transition-transform">
                                    <PiBriefcase />
                                </div>
                                <h3 className="font-mono text-xl font-bold mb-3 text-white">Workflow System</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    A dedicated Kanban board for your applications. Stop using messy spreadsheets and scattered notes.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E76F51]/50 transition-colors group">
                                <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl text-[#E76F51] mb-6 group-hover:scale-110 transition-transform">
                                    <PiChartLine />
                                </div>
                                <h3 className="font-mono text-xl font-bold mb-3 text-white">Match Analysis</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Instant feedback on how well your resume fits the JD. See your score and missing keywords immediately.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E76F51]/50 transition-colors group">
                                <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl text-[#E76F51] mb-6 group-hover:scale-110 transition-transform">
                                    <PiShieldCheck />
                                </div>
                                <h3 className="font-mono text-xl font-bold mb-3 text-white">Private Data</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Your data stays yours. We feature a 'Guest Mode' that requires no email to get started.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 text-center border-t border-white/10 bg-[#0E0E11] relative z-10">
                    <p className="font-mono text-sm text-gray-500">© 2024 SAHA Inc. All rights reserved.</p>
                </footer>
            </main>
        </div>
    )
}
