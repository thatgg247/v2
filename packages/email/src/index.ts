// ─────────────────────────────────────────────────────────────────────────────
// @seriesos/email — Server-side email service (SendGrid)
// Series OS owns the SendGrid key. All email goes through our sending domain.
// ─────────────────────────────────────────────────────────────────────────────

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const FROM = { email: process.env.SENDGRID_FROM_EMAIL!, name: process.env.SENDGRID_FROM_NAME! };
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

interface SendEmailOpts {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendEmailOpts): Promise<void> {
  await sgMail.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html, replyTo: opts.replyTo });
}

// ── Transactional email templates ────────────────────────────────────────────

export async function sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
  const url = `${APP_URL}/verify-email?token=${token}`;
  await sendEmail({
    to, subject: "Verify your Series OS email",
    html: `<p>Hi ${name},</p><p>Click the link below to verify your email and access your dashboard.</p>
<p><a href="${url}" style="background:#1F4E79;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Verify Email</a></p>
<p>This link expires in 24 hours.</p><p>— The Series OS Team</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
  const url = `${APP_URL}/reset-password?token=${token}`;
  await sendEmail({
    to, subject: "Reset your Series OS password",
    html: `<p>Hi ${name},</p><p>You requested a password reset. Click below to set a new password.</p>
<p><a href="${url}" style="background:#1F4E79;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Reset Password</a></p>
<p>This link expires in 1 hour. If you didn't request this, ignore this email.</p><p>— The Series OS Team</p>`,
  });
}

export async function sendTeamInviteEmail(to: string, inviterName: string, orgName: string, token: string): Promise<void> {
  const url = `${APP_URL}/signup?invite=${token}`;
  await sendEmail({
    to, subject: `${inviterName} invited you to ${orgName} on Series OS`,
    html: `<p>Hi,</p><p>${inviterName} has invited you to join <strong>${orgName}</strong> on Series OS — the operating system for founders.</p>
<p><a href="${url}" style="background:#1F4E79;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Accept Invitation</a></p>
<p>This invite expires in 7 days.</p><p>— The Series OS Team</p>`,
  });
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to, subject: "Welcome to Series OS 🚀",
    html: `<p>Hi ${name},</p>
<p>Your Series OS account is ready. Here's what to do first:</p>
<ol>
  <li><strong>Complete your company profile</strong> — powers your readiness score and investor matching</li>
  <li><strong>Run your readiness assessment</strong> — see exactly where you stand and what to do next</li>
  <li><strong>Build your data room</strong> — unlock your investor portal</li>
</ol>
<p><a href="${APP_URL}/dashboard" style="background:#1F4E79;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Go to Dashboard</a></p>
<p>Questions? Reply to this email — we read every one.</p><p>— The Series OS Team</p>`,
  });
}

export async function sendNotificationEmail(to: string, title: string, body: string, actionUrl?: string): Promise<void> {
  await sendEmail({
    to, subject: title,
    html: `<p>${body}</p>${actionUrl ? `<p><a href="${actionUrl}">View in Series OS →</a></p>` : ""}<p>— Series OS</p>`,
  });
}
