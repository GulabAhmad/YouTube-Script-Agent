import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/login', '/signup', '/forgot-password', '/verify-email', '/'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token');

    // If user is authenticated (has token) and tries to access public paths
    if (accessToken && publicPaths.includes(pathname)) {
        // Redirect to home page
        return NextResponse.redirect(new URL('/script-analyse', request.url));
    }

    // If user is not authenticated and tries to access protected paths
    if (!accessToken && !publicPaths.includes(pathname)) {
        // Redirect to login with the intended destination
        const loginUrl = new URL('/', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configure which paths to run middleware on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}; 