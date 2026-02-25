export function hasValidEmail(email?: string | null): boolean {
  if (!email) return false;

  const trimmed = email.trim();
  if (!trimmed) return false;

  // basic email pattern (real-world safe)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}