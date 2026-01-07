import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value; // Or check local storage on client, but middleware is server-side.
    // NOTE: Accessing localStorage is not possible in middleware.
    // AuthContext handles client-side redirection.
    // Middleware is good for initial server-side checks if cookies are used.
    // Since we are using localStorage in AuthContext (for simplicity in this iteration),
    // we will rely on client-side checks in Layouts or higher-order components.

    // However, to prevent flash of content, checking a cookie is best.
    // We haven't implemented cookie setting in login yet. 
    // I will stick to client-side checks for now in AuthContext and Layouts.
    // Middleware here can just be a pass-through or basic security headers.

    return NextResponse.next();
}

export const config = {
    matcher: '/dashboard/:path*',
};
