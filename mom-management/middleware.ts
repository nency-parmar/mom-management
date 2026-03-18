import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/login', '/signup'];

// Routes that only ADMIN users can access
const adminOnlyRoutes = [
    '/master', 
    '/attendance', 
    '/reports',
    '/meetings/new',
    '/meetings/edit'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for static files, API routes, and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    const userId = request.cookies.get('userId')?.value;
    const userRole = request.cookies.get('userRole')?.value;
    const isAuthenticated = !!userId;
    const isAdmin = userRole === 'ADMIN';

    // Check if current path is a public route
    const isPublicRoute = publicRoutes.some(
        route => pathname === route || pathname.startsWith(route + '/')
    );

    // 1. If NOT authenticated and trying to access a protected route → redirect to /login
    if (!isAuthenticated && !isPublicRoute) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    // 2. If authenticated and trying to access login/signup → redirect to dashboard
    if (isAuthenticated && isPublicRoute) {
        const dashboardUrl = new URL(
            isAdmin ? '/' : '/user-dashboard',
            request.url
        );
        return NextResponse.redirect(dashboardUrl);
    }

    // 3. If authenticated but NOT admin and trying to access admin-only routes → redirect to user dashboard
    if (isAuthenticated && !isAdmin) {
        const isAdminRoute =
            pathname === '/' ||
            adminOnlyRoutes.some(
                route => pathname === route || pathname.startsWith(route + '/')
            );

        if (isAdminRoute) {
            const userDashUrl = new URL('/user-dashboard', request.url);
            return NextResponse.redirect(userDashUrl);
        }
    }

    // 4. Allow the request through
    return NextResponse.next();
}

// Run middleware on all routes
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
