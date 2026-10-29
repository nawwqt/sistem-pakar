import { clearAuthCookie } from "@lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  await clearAuthCookie();
  const response = NextResponse.json({ success: true });
  response.cookies.set("bacabisa_token", "", { path: "/", maxAge: 0 });
  return response;
}

export async function GET(request) {
  await clearAuthCookie();
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set("bacabisa_token", "", { path: "/", maxAge: 0 });
  return response;
}
