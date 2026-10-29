import { NextResponse } from "next/server";
import { query } from "@lib/db";
import { hashPassword, signAuthToken, setAuthCookie } from "@lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const url = new URL(request.url);
  const protocol = process.env.NODE_ENV === "production" ? "https:" : (url.protocol || "http:");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${protocol}//${host}/api/auth/google/callback`;

  if (error || !code) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error || "Gagal mengautentikasi dengan Google.")}`,
        request.url
      )
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  try {
    // 1. Exchange code for Google access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Google token exchange error:", errText);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Gagal menukar kode otentikasi Google.")}`, request.url)
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch Google profile info
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Gagal mengambil data profil Google.")}`, request.url)
      );
    }

    const profile = await profileRes.json();
    const email = (profile.email || "").trim().toLowerCase();
    const name = profile.name || profile.given_name || "Pengguna Google";

    if (!email) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Email tidak ditemukan dari akun Google.")}`, request.url)
      );
    }

    // 3. Find or Create User in database
    let dbUser = null;
    const userRes = await query("SELECT * FROM users WHERE email = $1", [email]);

    if (userRes.rows.length > 0) {
      dbUser = userRes.rows[0];
    } else {
      // Auto-register user from Google
      const randomSecret = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const passwordHash = await hashPassword(randomSecret);
      const insertRes = await query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role",
        [name, email, passwordHash]
      );
      dbUser = insertRes.rows[0];
    }

    // 4. Sign JWT token
    const token = await signAuthToken({
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role || "user",
    });

    await setAuthCookie(token);

    // 5. Redirect based on role
    const dest = dbUser.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent("Terjadi kesalahan saat memproses login Google.")}`, request.url)
    );
  }
}
