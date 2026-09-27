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
    connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000,
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
    throw new Error('SMTP not configured');
  }

  const info = await agent.sendMail({
    from,
    to,
    subject,
    html,
    text,
    replyTo,
  });

  if (!info.accepted?.length || info.rejected?.length) throw new Error("SMTP recipient rejected");
  return { skipped: false };
}
