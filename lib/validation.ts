/**
 * Validation utilities for input sanitization and validation
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone: string): boolean => {
  // Supports: 10 digits, +91 prefix, with or without spaces/dashes
  const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ""));
};

/**
 * Sanitize string input (remove HTML/script tags)
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, "") // Remove < > characters
    .trim();
};

/**
 * Validate password strength
 */
export const isValidPassword = (
  password: string,
): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate date is in the past (for DOB)
 */
export const isValidDOB = (date: Date): boolean => {
  const now = new Date();
  const dob = new Date(date);

  // Check if valid date
  if (isNaN(dob.getTime())) return false;

  // Must be in the past
  if (dob >= now) return false;

  // Must be at least 10 years old
  const minAge = new Date();
  minAge.setFullYear(minAge.getFullYear() - 10);
  if (dob > minAge) return false;

  // Must be less than 120 years old
  const maxAge = new Date();
  maxAge.setFullYear(maxAge.getFullYear() - 120);
  if (dob < maxAge) return false;

  return true;
};

/**
 * Validate event dates
 */
export const isValidEventDates = (startDate: Date, endDate: Date): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if valid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

  // End date must be after start date
  if (end <= start) return false;

  return true;
};

/**
 * Validate MongoDB ObjectId format
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate amount (must be positive number)
 */
export const isValidAmount = (amount: number): boolean => {
  return typeof amount === "number" && amount > 0 && isFinite(amount);
};

/**
 * Rate limiting store (simple in-memory, for production use Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Check rate limit
 */
export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up old records periodically
  if (Math.random() < 0.01) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetAt < now) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (!record || record.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  if (record.count >= maxAttempts) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: maxAttempts - record.count };
};
