import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const match = url.match(/http:\/\/([^.]+)\.localhost/);
    if (match && match[1]) return match[1];
    if (hostname.includes(".localhost")) return hostname.split(".")[0];
    return null;
  }

  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    return hostname.split("---")[0];
  }

  const rootDomainFormatted = process.env.ROOT_DOMAIN || "localhost";
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const subdomain = extractSubdomain(request);

  if (subdomain) {
    const response = NextResponse.rewrite(
      new URL(`/s/subdomain${pathname}`, request.url)
    );
    response.headers.set("x-subdomain", subdomain); // Pass to frontend
    return response;
  }

  // Root domain logic
  const sessionCookie = getSessionCookie(request);
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.includes(pathname);

  if (!sessionCookie && isProtectedPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (pathname === "/" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    sessionCookie &&
    (pathname === "/auth/signup" || pathname === "/auth/login")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|[\\w-]+\\.\\w+).*)", // exclude /api, /_next, and public assets
  ],
};
