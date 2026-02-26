/**
 * Zapier integration helpers.
 * - API key auth for Zapier to fetch data from our API
 * - Optional webhook: POST to Zapier when new events occur (contact, dispute, facility submission)
 */

/** Verify Zapier/Admin API key from request. Returns true if valid. */
export function verifyZapierAuth(request: Request): boolean {
  const key = process.env.ADMIN_API_KEY;
  if (!key) return false;
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === key;
}

/** POST to Zapier webhook if configured. Fire-and-forget, no await. */
export function notifyZapier(event: string, payload: Record<string, unknown>): void {
  const url = process.env.ZAPIER_WEBHOOK_URL;
  if (!url) return;
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      ...payload,
      timestamp: new Date().toISOString(),
    }),
  }).catch((err) => console.error("[Zapier] Webhook error:", err));
}
