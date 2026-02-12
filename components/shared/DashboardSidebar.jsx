"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PiBriefcase, PiChartLine, PiGear, PiFiles, PiBookOpen } from "react-icons/pi"
import { clsx } from "clsx"

const navItems = [
    { name: "Tracker", href: "/tracker", icon: PiBriefcase },
    { name: "Analysis", href: "/analysis", icon: PiChartLine },
    { name: "Generator", href: "/generator", icon: PiFiles },
    { name: "Preparation", href: "/preparation", icon: PiBookOpen },
    { name: "Settings", href: "/settings", icon: PiGear },
]

export default function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-border bg-surface hidden md:flex flex-col h-screen fixed top-0 left-0 pt-16 z-30">
            <div className="p-6 space-y-6">
                {/* Workspace Label */}
                <div className="px-3">
                    <p className="text-xs font-mono font-bold text-secondary uppercase tracking-wider">
                        My Workspace
                    </p>
                </div>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.disabled ? '#' : item.href}
                                className={clsx(
                                    "group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    // Active State
                                    isActive
                                        ? "bg-white/10 text-primary shadow-lg shadow-black/20"
                                        : "text-secondary hover:bg-white/5 hover:text-primary",
                                    // Disabled State
                                    item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent !text-secondary"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={clsx("h-5 w-5", isActive ? "text-accent" : "text-secondary group-hover:text-primary")} />
                                    <span>{item.name}</span>
                                </div>

                                {/* Floating Badges for Future Phases */}
                                {item.disabled && (
                                    <span className="text-[10px] bg-white/5 text-secondary px-1.5 py-0.5 rounded border border-border font-mono">
                                        SOON
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </aside>
    )
}
