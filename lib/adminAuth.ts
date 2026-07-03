import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "fp_admin_session";

export function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD_HASH;
  if (!expected) return false;
  return hashPassword(password) === expected;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  // For an MVP, a signed random token stored server-side (or a JWT) is a better fit than
  // a static value — this stub sets a marker cookie. Swap in Supabase Auth or a proper
  // session store before handling real client data in production.
  cookieStore.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "authenticated";
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
