import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

async function getAuthToken(request) {
  const isSecure =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https" ||
    request.cookies.has("__Secure-authjs.session-token") ||
    request.cookies.has("__Secure-next-auth.session-token");

  // 1. Try secureCookie based on environment/cookie presence
  let token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecure,
  });

  // 2. Fallback to alternative cookie variant (essential for Vercel & HTTPS/HTTP proxies)
  if (!token) {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isSecure,
    });
  }

  return token;
}

export async function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const token = await getAuthToken(request);

  // 1. Dedicated Admin Login Page (/admin)
  if (pathname === "/admin") {
    if (token) {
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
      return NextResponse.redirect(new URL(`/dashboard/${token.role || "student"}`, request.url));
    }
    // Unauthenticated: allow page to render the dedicated Admin sign-in UI
    return NextResponse.next();
  }

  // 2. Dedicated Coach Login Page (/coach)
  if (pathname === "/coach") {
    if (token) {
      if (token.role === "coach") {
        return NextResponse.redirect(new URL("/dashboard/coach", request.url));
      }
      return NextResponse.redirect(new URL(`/dashboard/${token.role || "student"}`, request.url));
    }
    // Unauthenticated: allow page to render the dedicated Coach sign-in UI
    return NextResponse.next();
  }

  // 3. Dedicated Student Login Page (/login)
  if (pathname === "/login") {
    // Redirect query params targeting other portals to their dedicated URLs
    const portal = request.nextUrl.searchParams.get("portal");
    if (portal === "coach") {
      return NextResponse.redirect(new URL("/coach", request.url));
    }
    if (portal === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (token) {
      const destination = token.role === "admin" ? "/dashboard/admin" : token.role === "coach" ? "/dashboard/coach" : "/dashboard/student";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // 4. Admin Dashboard Protection (/dashboard/admin, /dashboard/admin/:path*)
  if (pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (token.role !== "admin") {
      const destination = token.role === "coach" ? "/dashboard/coach" : "/dashboard/student";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // 5. Coach Dashboard Protection (/dashboard/coach, /dashboard/coaches, etc.)
  if (
    pathname === "/dashboard/coach" ||
    pathname.startsWith("/dashboard/coach/") ||
    pathname === "/dashboard/coaches" ||
    pathname.startsWith("/dashboard/coaches/")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/coach", request.url));
    }
    if (token.role !== "coach") {
      const destination = token.role === "admin" ? "/dashboard/admin" : "/dashboard/student";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    if (pathname === "/dashboard/coaches" || pathname.startsWith("/dashboard/coaches/")) {
      return NextResponse.redirect(new URL("/dashboard/coach", request.url));
    }
    return NextResponse.next();
  }

  // 6. Generic Root Dashboard (/dashboard)
  if (pathname === "/dashboard") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const role = ["admin", "coach", "student"].includes(token.role) ? token.role : "student";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // 7. Student Dashboard Protection (/dashboard/student, /dashboard/student/:path*)
  if (pathname === "/dashboard/student" || pathname.startsWith("/dashboard/student/")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== "student") {
      const destination = token.role === "admin" ? "/dashboard/admin" : "/dashboard/coach";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin",
    "/coach",
    "/login",
  ],
};
