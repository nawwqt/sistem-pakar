import { NextResponse } from "next/server";
import { query } from "@lib/db";
import { hashPassword, signAuthToken, setAuthCookie } from "@lib/auth";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode") || "login"; // 'login' or 'register'
  const isDemo = searchParams.get("demo") === "true";

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // Only run demo simulation if explicitly requested via ?demo=true
  if (isDemo) {
    try {
      const demoEmail = "pengguna.google@gmail.com";
      const demoName = "Pengguna Google";

      let dbUser = null;
      const userRes = await query("SELECT * FROM users WHERE email = $1", [demoEmail]);

      if (userRes.rows.length > 0) {
        dbUser = userRes.rows[0];
      } else {
        const dummyHash = await hashPassword("google_oauth_dummy_" + Date.now());
        const insertRes = await query(
          "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, name, email, role",
          [demoName, demoEmail, dummyHash]
        );
        dbUser = insertRes.rows[0];
      }

      const token = await signAuthToken({
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role || "user",
      });

      await setAuthCookie(token);

      const dest = dbUser.role === "admin" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    } catch (err) {
      console.error("Demo Google login error:", err);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent("Gagal masuk dengan akun Google simulasi.")}`, request.url)
      );
    }
  }

  // If real credentials are missing:
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(
          "Integrasi Google OAuth memerlukan GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di file .env. Silakan tambahkan kredensial dari Google Cloud Console."
        )}`,
        request.url
      )
    );
  }

  // Standard Google OAuth 2.0 flow
  const url = new URL(request.url);
  const protocol = process.env.NODE_ENV === "production" ? "https:" : (url.protocol || "http:");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:3000";
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${protocol}//${host}/api/auth/google/callback`;

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", mode);

  return NextResponse.redirect(googleAuthUrl.toString());
}
