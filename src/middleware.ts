import { type NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local dev support
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const match = url.match(/http:\/\/([^.]+)\.localhost/);
    if (match && match[1]) return match[1];
    if (hostname.includes('.localhost')) return hostname.split('.')[0];
    return null;
  }

  // Preview deployments
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    return hostname.split('---')[0];
  }

  // Production subdomains
const rootDomainFormatted = process.env.ROOT_DOMAIN || "localhost";
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  // If subdomain is present
  if (subdomain) {
    // Block admin access on subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Rewrite `/` to `/s/[subdomain]`
   if (subdomain && !pathname.startsWith('/s/')) {
  const rewrittenUrl = new URL(`/s/${subdomain}${pathname}`, request.url);
  return NextResponse.rewrite(rewrittenUrl);
}


    return NextResponse.next(); // allow other subdomain paths
  }

  // Root domain: session-based redirect logic
  const sessionCookie = getSessionCookie(request);

  // Redirect unauthenticated users trying to access protected pages
  const protectedPaths = ['/dashboard']; // root-level protected paths
  const isProtectedPath = protectedPaths.includes(pathname);

  if (!sessionCookie && isProtectedPath) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect logged-in users away from landing page `/` (but NOT from other pages)
  if (pathname === '/' && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect logged-in users away from signup and login forms
  if (sessionCookie && (pathname === '/auth/signup' || pathname === '/auth/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next|[\\w-]+\\.\\w+).*)' // exclude /api, /_next, and public assets
  ]
};
