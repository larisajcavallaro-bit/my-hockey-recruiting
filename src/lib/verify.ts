/**
 * Twilio Verify API - sends OTP via pre-approved templates.
 * Requires: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID
 */

/** Normalize phone to E.164. Use same format for send and check to avoid Twilio mismatch. */
export function ensureE164(phone: string): string {
  const digits = phone.replace(/\D/g, "").trim();
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export async function sendVerification(to: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return false;
  }

  try {
    const res = await fetch(
      `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          To: ensureE164(to),
          Channel: "sms",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Twilio Verify error:", err);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Twilio Verify error:", error);
    return false;
  }
}

export type CheckResult = { ok: true } | { ok: false; twilioCode?: number; twilioMessage?: string };

export async function checkVerification(to: string, code: string): Promise<CheckResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return { ok: false };
  }

  const normalizedPhone = ensureE164(to);
  const trimmedCode = String(code).trim();

  try {
    const res = await fetch(
      `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationCheck`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          To: normalizedPhone,
          Code: trimmedCode,
        }),
      }
    );

    const data = (await res.json().catch(() => ({}))) as {
      status?: string;
      valid?: boolean;
      code?: number;
      error_code?: number;
      message?: string;
    };

    if (!res.ok) {
      const twilioCode = data.error_code ?? data.code;
      console.error("[Twilio Verify] check failed:", {
        status: res.status,
        code: twilioCode,
        message: data.message,
        to: normalizedPhone.replace(/(\+?\d{4})\d+(\d{4})/, "$1****$2"),
        raw: data,
      });
      return {
        ok: false,
        twilioCode,
        twilioMessage: data.message,
      };
    }

    // Twilio returns status: "approved" on success; valid: true is legacy fallback
    const approved = data.status === "approved" || data.valid === true;
    if (approved) {
      return { ok: true };
    }
    // e.g. "pending" or "canceled" – code wrong or expired
    console.error("[Twilio Verify] status not approved:", { status: data.status, valid: data.valid, raw: data });
    return { ok: false };
  } catch (error) {
    console.error("Twilio Verify check error:", error);
    return { ok: false };
  }
}
