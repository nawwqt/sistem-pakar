import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const TOKEN_COOKIE_NAME = "bacabisa_token";
const SECRET_KEY = process.env.AUTH_SECRET || "bacabisa_secret_key_minimum_32_chars_long_2026!";
const encodedKey = new TextEncoder().encode(SECRET_KEY);

async function getCookieStore() {
  try {
    const nextHeaders = await import("next/headers");
    return nextHeaders.cookies();
  } catch (err) {
    return null;
  }
}

export async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 10);
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function signAuthToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, encodedKey);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function setAuthCookie(token) {
  const cookieStore = await getCookieStore();
  if (cookieStore) {
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
}

export async function clearAuthCookie() {
  const cookieStore = await getCookieStore();
  if (cookieStore) {
    cookieStore.set(TOKEN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await getCookieStore();
    if (!cookieStore) return null;
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAuthToken(token);
  } catch (err) {
    return null;
  }
}

export { TOKEN_COOKIE_NAME };
