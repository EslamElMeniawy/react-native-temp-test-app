export const emailRegExp = /^\w+([.-]?\w+)*@[a-zA-Z_]+?.[a-zA-Z]{2,3}$/g;

/**
 * Password Rules:
 * - Minimum 8 characters.
 * - Maximum 50 characters.
 * - Contains at least a capital letter.
 * - Contains at least a small letter.
 * - Contains at least a number.
 */
export const passwordRegExp =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,50}$/g;

/**
 * Phone Validation (Kuwait):
 * - Start with optional "+965".
 * - Followed by "5" or "6" or "9".
 * - Followed by any 7 digits.
 */
export const phoneRegExp = /^(\+965)?[569]\d{7}$/g;

/**
 * Name Validation:
 * - Containing characters and spaces only.
 */
export const nameRegExp = /^[{\p{L}} ]+$/u;
