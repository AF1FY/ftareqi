import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const pathname = req.nextUrl.pathname;

    // 1. Check if the user is authenticated and the token is valid
    const isAuthenticated = !!token && !token.isRefreshTokenExpired;

    // 2. Normalize roles: Handle both string and array formats
    // If it's an array, keep it. If it's a string, wrap it in an array. If null, return empty array.
    const userRoles: string[] = Array.isArray(token?.role)
        ? (token.role as string[])
        : token?.role
            ? [token.role as string]
            : [];

    // 3. Define allowed roles for the dashboard
    const dashboardRoles = ["Admin", "Moderator"];
    const hasAccess = userRoles.some(role => dashboardRoles.includes(role));
    const isAdmin = userRoles.includes('Admin');
    // --- Guards Logic ---

    // Dashboard Guard: Protect all /dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        if (!hasAccess || (pathname.includes('users') && !isAdmin)) {
            // Using rewrite to keep the URL but show the Forbidden content
            return NextResponse.rewrite(new URL("/forbidden", req.url));
        }
    }

    // Auth Pages Guard: Prevent logged-in users from accessing Login/Register
    const authPages = ["/login", "/register"];
    if (isAuthenticated && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/login",
        "/register",
        "/dashboard/:path*"
    ]
}