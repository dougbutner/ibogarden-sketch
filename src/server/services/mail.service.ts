import nodemailer from "nodemailer";

import { getServerConfig } from "@/lib/config.server";

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
};

function getMailFrom(): string {
  return process.env.MAIL_FROM ?? "ibo.garden <notifications@ibo.garden>";
}

async function sendViaResend(input: SendMailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getMailFrom(),
      to: [input.to],
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }
}

async function sendViaSmtp(input: SendMailInput): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return;

  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = process.env.SMTP_SECURE !== "false";

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: getMailFrom(),
    to: input.to,
    subject: input.subject,
    text: input.text,
  });
}

export async function sendMail(input: SendMailInput): Promise<boolean> {
  if (process.env.RESEND_API_KEY) {
    await sendViaResend(input);
    return true;
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    await sendViaSmtp(input);
    return true;
  }

  console.warn("[mail] No mail provider configured (set RESEND_API_KEY or SMTP_* env vars)");
  return false;
}

export async function notifyAdminNetworkApplication(input: {
  applicationId: number;
  organizationName: string;
  email: string;
  country: string;
  partnerTypeSlug: string;
  credentials?: string;
  gabonFirstSourcing: boolean;
  southeastAfrica: boolean;
  solanaWallet?: string;
}): Promise<void> {
  const { adminEmail } = getServerConfig();
  const lines = [
    "New ibo.garden network application",
    "",
    `Application ID: ${input.applicationId}`,
    `Organization: ${input.organizationName}`,
    `Email: ${input.email}`,
    `Country: ${input.country}`,
    `Category: ${input.partnerTypeSlug}`,
    `Gabon-first sourcing: ${input.gabonFirstSourcing ? "Yes" : "No"}`,
    `Southeast Africa: ${input.southeastAfrica ? "Yes" : "No"}`,
  ];

  if (input.credentials) lines.push("", "Credentials / lineage:", input.credentials);
  if (input.solanaWallet) lines.push("", `Solana wallet: ${input.solanaWallet}`);

  lines.push("", "Review in admin: /admin");

  try {
    await sendMail({
      to: adminEmail,
      subject: `[ibo.garden] Network application: ${input.organizationName}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("[mail] Failed to send network application notification:", error);
  }
}
