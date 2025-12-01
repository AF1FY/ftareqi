import { getToken } from 'next-auth/jwt'
import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {

    const token = await getToken({ req })
    console.log("----------Token from middleware : ", token);
    const pathname = req.nextUrl.pathname;
    const unAuthenticatedPages = ["/login", "/register"];
    const authenticatedRoutes = ["/",]
    if (!token && authenticatedRoutes.includes(pathname))
        return NextResponse.redirect(new URL("/login", req.url))
    else if (token && unAuthenticatedPages.includes(pathname))
        return NextResponse.redirect(new URL("/", req.url))
    return NextResponse.next();
}

export const config = {
    matcher: ["/",
        "/product",
        "/login",
        "/register",
    ]
}