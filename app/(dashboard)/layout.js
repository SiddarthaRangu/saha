import DashboardSidebar from "@/components/shared/DashboardSidebar"

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-dark-bg">
            <DashboardSidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 bg-dark-bg min-h-screen pt-16">
                {children}
            </main>
        </div>
    )
}
