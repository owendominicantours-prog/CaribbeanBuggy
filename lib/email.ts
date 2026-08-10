import nodemailer from 'nodemailer';

type MailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

const host = process.env.SMTP_HOST ?? 'smtp.zoho.com';
const port = Number(process.env.SMTP_PORT ?? '465');
const user = process.env.SMTP_USER ?? 'info@proactivitis.com';
const pass = process.env.SMTP_PASS;
const from = process.env.EMAIL_FROM ?? 'Caribbean Buggy <info@proactivitis.com>';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!pass) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendEmail({ to, subject, html, text, replyTo }: MailInput) {
  const agent = getTransporter();

  if (!agent) {
    console.warn('email_not_configured_missing_smtp_pass', { to, subject });
    return { skipped: true };
  }

  await agent.sendMail({
    from,
    to,
    subject,
    html,
    text,
    replyTo,
  });

  return { skipped: false };
}
