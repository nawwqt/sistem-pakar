import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_COOKIE_NAME = "bacabisa_token";
const SECRET_KEY = process.env.AUTH_SECRET || "bacabisa_secret_key_minimum_32_chars_long_2026!";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  let user = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, encodedKey);
      user = payload;
    } catch (err) {
      user = null;
    }
  }

  const isAuthRoute = pathname === "/login" || pathname === "/daftar";
  const isAdminRoute = pathname.startsWith("/admin");
  const isUserProtectedRoute =
    pathname === "/dashboard" ||
    pathname === "/menu" ||
    pathname === "/riwayat" ||
    pathname === "/diagnosis" ||
    pathname.startsWith("/diagnosis/");

  // If logged in and accessing login or daftar, redirect appropriately
  if (isAuthRoute && user) {
    const dest = user.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // If accessing user protected routes without login
  if (isUserProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing admin routes
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "admin") {
      // Non-admin redirect to /dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/menu",
    "/diagnosis/:path*",
    "/riwayat",
    "/admin/:path*",
    "/login",
    "/daftar",
  ],
};
