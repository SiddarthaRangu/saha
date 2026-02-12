"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { PiSignOut } from "react-icons/pi"
import { signOut } from "next-auth/react"

export default function Navbar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    // Hide navbar on auth pages only
    const isAuthPage = pathname.startsWith('/auth')
    if (isAuthPage) return null

    // Determine if we are in dashboard or on landing/guest pages
    const isDashboard = pathname.startsWith('/tracker') ||
        pathname.startsWith('/analysis') ||
        pathname.startsWith('/preparation') ||
        pathname.startsWith('/generator') ||
        pathname.startsWith('/settings')

    // Landing page (dark theme)
    if (pathname === '/') {
        return (
            <nav className="border-b border-white/10 bg-[#0E0E11]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-black font-mono font-bold">
                                S
                            </div>
                            <span className="font-mono font-bold text-lg tracking-tight text-white">SAHA</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/auth/login">
                                <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">Login</Button>
                            </Link>
                            <Link href="/auth/register">
                                <Button className="bg-white text-black hover:bg-gray-200 border-none">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    // Dashboard navbar
    if (isDashboard) {
        const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'User'
        const userInitial = userName.charAt(0).toUpperCase()

        // Mapping for cleaner names
        const nameMapping = {
            'tracker': 'Pipeline',
            'analysis': 'Analysis',
            'generator': 'Content Writer',
            'preparation': 'Interview Prep',
            'settings': 'Settings'
        }

        const pathSegments = pathname.split('/').filter(Boolean)
        const displayPath = nameMapping[pathSegments[0]] || pathSegments[pathSegments.length - 1]

        return (
            <nav className="h-16 border-b border-white/10 bg-surface/80 backdrop-blur-md sticky top-0 z-40 w-full pl-64 transition-all">
                <div className="h-full px-8 flex justify-between items-center">
                    {/* Breadcrumbs / Page Title */}
                    <div className="flex items-center gap-2">
                        <span className="text-secondary text-sm font-mono opacity-50">#</span>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                            {displayPath}
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                            <div className="h-6 w-6 bg-accent rounded-full flex items-center justify-center text-white text-[10px] font-black italic">
                                S
                            </div>
                            <span className="text-xs font-mono font-bold text-primary hidden md:block tracking-tight">{userName}</span>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="text-secondary hover:text-accent hover:bg-white/5 text-[10px] font-mono font-bold uppercase tracking-widest h-8"
                        >
                            <PiSignOut className="mr-2" /> Logout
                        </Button>
                    </div>
                </div>
            </nav>
        )
    }

    // Guest pages (like /analyze) - Full Dark Navbar
    return (
        <nav className="h-16 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full">
            <div className="h-full px-8 flex justify-between items-center max-w-7xl mx-auto">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-black font-mono font-bold group-hover:scale-110 transition-transform">
                        S
                    </div>
                    <span className="font-mono font-bold text-lg tracking-tight text-white group-hover:text-accent transition-colors">SAHA</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/auth/login">
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">Login</Button>
                    </Link>
                    <Link href="/auth/register">
                        <Button className="bg-white text-black hover:bg-gray-200 border-none px-6">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
