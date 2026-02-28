/**
 * Test/demo account emails whose profiles (coaches, players) should be hidden from real users.
 * These accounts are used for development and demos—parents and coaches browsing the site
 * should not see their profiles or kids.
 */
export const TEST_ACCOUNT_EMAILS = [
  "admin@example.com",
  "coach@example.com",
  "parent@example.com",
  "gold-test@example.com",
  "elite-test@example.com",
].map((e) => e.toLowerCase());

export function isTestAccount(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  return TEST_ACCOUNT_EMAILS.includes(email.trim().toLowerCase());
}
