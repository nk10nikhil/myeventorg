import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/admin/dashboard",
    "/admin/scanner",
    "/super-admin/dashboard",
  ];
  const authRoutes = ["/login", "/register"];

  // Redirect authenticated users away from auth pages
  if (token && authRoutes.some((route) => pathname === route)) {
    // Decode token to check role (basic decode for redirect only, full verification in API routes)
    try {
      const payload = JSON.parse(
        Buffer.from(token.split(".")[1], "base64").toString(),
      );

      // Basic expiry check
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        // Token expired, clear cookie and continue
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }

      if (payload.role === "user") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else if (payload.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      } else if (payload.role === "superadmin") {
        return NextResponse.redirect(
          new URL("/super-admin/dashboard", request.url),
        );
      }
    } catch (error) {
      // Invalid token, clear cookie
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  // Redirect authenticated users away from login pages (exact match)
  if (token) {
    if (pathname === "/admin") {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );
        if (payload.role === "admin") {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url),
          );
        }
      } catch (error) {
        // Invalid token
      }
    } else if (pathname === "/super-admin") {
      try {
        const payload = JSON.parse(
          Buffer.from(token.split(".")[1], "base64").toString(),
        );
        if (payload.role === "superadmin") {
          return NextResponse.redirect(
            new URL("/super-admin/dashboard", request.url),
          );
        }
      } catch (error) {
        // Invalid token
      }
    }
  }

  // Protect routes from unauthenticated users
  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (pathname.startsWith("/super-admin")) {
      return NextResponse.redirect(new URL("/super-admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/super-admin/:path*",
    "/login",
    "/register",
  ],
};
