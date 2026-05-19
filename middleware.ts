import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/register") ||
    request.nextUrl.pathname.startsWith("/password") ||
    request.nextUrl.pathname.startsWith("/verify");

  // Om vi är på en inloggad sida (tex. dashboard) men saknar token -> skicka till sign-in
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Om vi redan är inloggade och försöker gå till sign-in -> skicka till dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Matchar alla request paths utom för:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - bilder och svg:er
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)",
  ],
};
