import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "dt_session";
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30d").sign(key());
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
}

export async function getSessionUserId() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key())).payload.userId as string; } catch { return null; }
}

export async function clearSession() { (await cookies()).delete(COOKIE); }
