import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
async function getAuthToken(request) {
  const isSecure = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https" || request.cookies.has("__Secure-authjs.session-token") || request.cookies.has("__Secure-next-auth.session-token");
  let token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: isSecure
  });
  if (!token) {
    token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isSecure
    });
  }
  return token;
}
export async function proxy(request) {
  const {
    pathname,
    search
  } = request.nextUrl;
  if (request.nextUrl.searchParams.get("logout") === "true" || request.nextUrl.searchParams.get("signout") === "true") {
    return NextResponse.redirect(new URL("/api/auth/clear", request.url));
  }
  const token = await getAuthToken(request);
  const isSwitching = request.nextUrl.searchParams.get("switch") === "true";
  if (pathname === "/admin") {
    if (token && !isSwitching) {
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard/admin", request.url));
      }
      return NextResponse.redirect(new URL(`/dashboard/${token.role || "student"}`, request.url));
    }
    return NextResponse.next();
  }
  if (pathname === "/coach") {
    if (token && !isSwitching) {
      if (token.role === "coach") {
        return NextResponse.redirect(new URL("/dashboard/coach", request.url));
      }
      return NextResponse.redirect(new URL(`/dashboard/${token.role || "student"}`, request.url));
    }
    return NextResponse.next();
  }
  if (pathname === "/login") {
    const portal = request.nextUrl.searchParams.get("portal");
    if (portal === "coach") {
      return NextResponse.redirect(new URL("/coach", request.url));
    }
    if (portal === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (token && !isSwitching) {
      const destination = token.role === "admin" ? "/dashboard/admin" : token.role === "coach" ? "/dashboard/coach" : "/dashboard/student";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }
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
  if (pathname === "/dashboard/coach" || pathname.startsWith("/dashboard/coach/") || pathname === "/dashboard/coaches" || pathname.startsWith("/dashboard/coaches/")) {
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
  if (pathname === "/dashboard") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const role = ["admin", "coach", "student"].includes(token.role) ? token.role : "student";
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }
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
  matcher: ["/dashboard/:path*", "/admin", "/coach", "/login"]
};
