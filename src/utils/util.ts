// TODO: add common function/algo here

/**
 * Email must be the format of:
 * abcd@xxx.com
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password must be:
 * 1. At least 8 chars
 * 2. At least one lowercase letter
 * 3. At least one uppercase letter
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

/**
 * SSN must be xxx-xx-xxxx
 */
export const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;

/**
 * Letters a-z A-Z 0-9 _
 * Length must be {5, 16}
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,16}$/;

/**
 * Get the time ago from the milliseconds
 * @param ms - The milliseconds
 * @returns The time ago
 */
export function getTimeAgo(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
