// ─────────────────────────────────────────────────────────────────────────────
// @seriesos/lib — Shared utilities, constants, and types
// ─────────────────────────────────────────────────────────────────────────────

// Plan limits
export const PLAN_LIMITS = {
  FOUNDER_STARTER: { companies: 1, seats: 1, aiCredits: 100 },
  FOUNDER_PRO:     { companies: 3, seats: 3, aiCredits: 500 },
  FOUNDER_SCALE:   { companies: 5, seats: 5, aiCredits: 2000 },
  ADVISOR:         { companies: 10, seats: 5, aiCredits: 1000 },
  ACCELERATOR:     { companies: 50, seats: 20, aiCredits: 10000 },
  ENTERPRISE:      { companies: Infinity, seats: Infinity, aiCredits: Infinity },
} as const;

// Stripe price IDs (set via environment variables)
export const STRIPE_PRICES = {
  FOUNDER_STARTER: process.env.STRIPE_PRICE_FOUNDER_STARTER!,
  FOUNDER_PRO:     process.env.STRIPE_PRICE_FOUNDER_PRO!,
  FOUNDER_SCALE:   process.env.STRIPE_PRICE_FOUNDER_SCALE!,
  ADVISOR:         process.env.STRIPE_PRICE_ADVISOR!,
  ACCELERATOR:     process.env.STRIPE_PRICE_ACCELERATOR!,
} as const;

// Outreach protection constants
export const OUTREACH_LIMITS = {
  DAILY_MAX_PER_COMPANY: 50,
  FIRM_COOLDOWN_DAYS: 14,
  INDIVIDUAL_COOLDOWN_DAYS: 30,
  MIN_SEQUENCE_GAP_DAYS: 3,
  MIN_MATCH_SCORE: 65,
  MAX_BOUNCE_RATE_PCT: 5,
} as const;

// Readiness score weights
export const READINESS_WEIGHTS = {
  companyProfile:  0.15,
  team:            0.10,
  product:         0.15,
  market:          0.10,
  financials:      0.15,
  legal:           0.10,
  compliance:      0.10,
  dataRoom:        0.10,
  fundingStrategy: 0.05,
} as const;

// Encryption helper (AES-256-GCM)
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) throw new Error("ENCRYPTION_KEY environment variable is not set");
  return Buffer.from(key, "hex").slice(0, KEY_LENGTH);
}

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const key = getEncryptionKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), encrypted.toString("hex")].join(":");
}

export function decrypt(ciphertext: string): string {
  const [ivHex, tagHex, encryptedHex] = ciphertext.split(":");
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return decipher.update(Buffer.from(encryptedHex, "hex")).toString("utf8") + decipher.final("utf8");
}

// Slug generator
export function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}

// Verification code
export function generateVerificationCode(): string {
  return crypto.randomUUID();
}

// SHA-256 hash (for duplicate email detection)
export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

// Format USD
export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

// Date helpers
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isAfterDays(date: Date, days: number): boolean {
  return new Date() > addDays(date, days);
}

// Type guards
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };
