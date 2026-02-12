import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/auth/login",
    },
})

export const config = {
    matcher: ["/tracker/:path*", "/analysis/:path*", "/preparation/:path*", "/settings/:path*"]
}
