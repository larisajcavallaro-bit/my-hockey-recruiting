/**
 * Send SMS via Twilio. Requires:
 * TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env
 *
 * Phone numbers must be E.164 format (e.g. +15551234567).
 * Returns true if sent, false if Twilio not configured.
 */
export async function sendSms(to: string, body: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    return false;
  }

  try {
    const client = (await import("twilio")).default(accountSid, authToken);
    await client.messages.create({
      body,
      from,
      to: ensureE164(to),
    });
    return true;
  } catch (error) {
    console.error("Twilio SMS error:", error);
    return false;
  }
}

function ensureE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}
