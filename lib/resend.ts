import { Resend } from "resend";

let _resend: Resend | null = null;

// Lazy singleton. Next.js imports every route module during the build's "collect page data"
// step, so constructing Resend eagerly at module scope throws if the env var isn't set yet
// even if you never actually call it at build time. Building it on first real use avoids that.
export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "re_build_placeholder");
  }
  return _resend;
}

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "First Premier MLS Direct <orders@firstpremiermlsdirect.com>";
