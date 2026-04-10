import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function proxy(req: NextRequest) {
    const token = await getToken({ req });
    const pathname = req.nextUrl.pathname;

    // 1. Check if the user is authenticated and the token is valid
    const isAuthenticated = !!token && !token.isRefreshTokenExpired;

    // 2. Define strictly public routes
    const publicRoutes = ["/", "/login", "/register", "/verify"];
    const isPublicRoute = publicRoutes.includes(pathname);

    // 3. Global Unauthenticated Guard
    // If user is NOT logged in and trying to access a non-public route -> redirect to login
    if (!isAuthenticated && !isPublicRoute) {
        // Advanced UX: Save the attempted URL to redirect back after login
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 4. Auth Pages Guard
    // Prevent logged-in users from accessing Login/Register
    const authPages = ["/login", "/register"];
    if (isAuthenticated && authPages.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 5. Dashboard & Role-Based Guard (Only executed if authenticated)
    if (isAuthenticated && pathname.startsWith('/dashboard')) {
        // Normalize roles: Handle both string and array formats
        const userRoles: string[] = Array.isArray(token?.role)
            ? (token.role as string[])
            : token?.role
                ? [token.role as string]
                : [];

        // Define allowed dashboard roles
        const dashboardRoles = ["Admin", "Moderator"];
        const hasAccess = userRoles.some(role => dashboardRoles.includes(role));
        const isAdmin = userRoles.includes('Admin');

        // Check permissions
        if (!hasAccess || (pathname.includes('users') && !isAdmin)) {
            // Using rewrite to keep the URL but show the Forbidden content
            return NextResponse.rewrite(new URL("/forbidden", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // This matcher catches ALL routes EXCEPT Next.js internal files, static assets, and API routes.
    // This ensures your global unauthenticated guard works everywhere securely.
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}