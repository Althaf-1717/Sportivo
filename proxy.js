import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const roleForPath = (pathname) => {
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  if (pathname.startsWith("/dashboard/coach")) return "coach";
  if (pathname.startsWith("/dashboard/student")) return "student";
  return null;
};

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

  // Handle direct /admin or /dashboard/admin
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/")) {
    const target = pathname.startsWith("/admin") ? (pathname === "/admin" ? "/dashboard/admin" : `/dashboard/admin/${pathname.slice(7)}`) : pathname;
    const token = await getAuthToken(request);
    if (!token || token.role !== "admin") {
      const login = new URL("/login", request.url);
      login.searchParams.set("portal", "admin");
      login.searchParams.set("callbackUrl", `${target}${search}`);
      return NextResponse.redirect(login);
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL(`${target}${search}`, request.url));
    }
    return NextResponse.next();
  }

  // Handle direct /coach, /dashboard/coaches, or /dashboard/coach
  if (
    pathname === "/coach" ||
    pathname.startsWith("/coach/") ||
    pathname === "/dashboard/coaches" ||
    pathname.startsWith("/dashboard/coaches/") ||
    pathname === "/dashboard/coach" ||
    pathname.startsWith("/dashboard/coach/")
  ) {
    const token = await getAuthToken(request);
    if (!token || token.role !== "coach") {
      const login = new URL("/login", request.url);
      login.searchParams.set("portal", "coach");
      login.searchParams.set("callbackUrl", "/dashboard/coach");
      return NextResponse.redirect(login);
    }
    if (pathname !== "/dashboard/coach" && !pathname.startsWith("/dashboard/coach/")) {
      return NextResponse.redirect(new URL("/dashboard/coach", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/dashboard") {
    const token = await getAuthToken(request);
    if (!token) return NextResponse.redirect(new URL("/login?callbackUrl=%2Fdashboard", request.url));
    const role = ["admin", "coach", "student"].includes(token.role) ? token.role : "student";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  const requiredRole = roleForPath(pathname);
  if (!requiredRole) return NextResponse.next();
  const token = await getAuthToken(request);
  if (!token || token.role !== requiredRole) {
    const login = new URL("/login", request.url);
    login.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/coach",
    "/coach/:path*",
  ],
};
