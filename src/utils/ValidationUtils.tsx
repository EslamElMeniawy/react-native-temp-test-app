export const emailRegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

/**
 * Password Rules:
 * - Minimum 6 characters.
 * - Contains at least a letter.
 * - Contains at least a number.
 */
export const passwordRegExp = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/g;

/**
 * Phone Validation (Kuwait):
 * - Start with optional "+965".
 * - Followed by "5" or "6" or "9".
 * - Followed by any 7 digits.
 */
export const phoneRegExp = /^(\+965)?[569]\d{7}$/g;
