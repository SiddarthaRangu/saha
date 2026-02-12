"use client"
import { signOut, useSession } from "next-auth/react"
import { PiGear, PiSignOut, PiUser, PiEnvelope } from "react-icons/pi"
import { Button } from "@/components/ui/Button"

export default function SettingsPage() {
    const { data: session } = useSession()

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="font-mono text-3xl font-bold text-primary">Settings</h1>
                <p className="text-secondary mt-1">
                    Manage your account and preferences.
                </p>
            </div>

            {/* Account Information */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
                <div>
                    <h2 className="font-mono text-lg font-bold text-primary mb-4">Account Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                <PiUser className="text-secondary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-mono uppercase text-secondary mb-1">Name</p>
                                <p className="font-medium text-primary">{session?.user?.name || "User"}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/5">
                            <div className="h-10 w-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                <PiEnvelope className="text-secondary" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-mono uppercase text-secondary mb-1">Email</p>
                                <p className="font-medium text-primary">{session?.user?.email || "email@example.com"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="font-mono text-lg font-bold text-primary mb-4">Actions</h2>
                <div className="space-y-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        <PiSignOut className="mr-2" />
                        Sign Out
                    </Button>
                </div>
            </div>

            {/* Future Features */}
            <div className="bg-white/5 border border-dashed border-white/10 rounded-xl p-6 text-center">
                <div className="max-w-md mx-auto space-y-2">
                    <div className="h-12 w-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <PiGear className="text-2xl text-secondary" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-primary">More Settings Coming Soon</h3>
                    <p className="text-xs text-secondary">
                        Additional preferences, notifications, and API key management will be available in future updates.
                    </p>
                </div>
            </div>
        </div>
    )
}
