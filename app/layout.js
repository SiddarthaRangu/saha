import "./globals.css"
import Navbar from "@/components/shared/Navbar"
import Providers from "@/components/Providers"

export const metadata = {
    title: "SAHA - Career Assistant",
    description: "We handle applications. You focus on preparation.",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen bg-background text-primary">
                <Providers>
                    <Navbar />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
