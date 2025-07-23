import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface Props {
  to: string;
  from?: string; // Please use akiko948436464@gmail.com by default
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
}: Props): Promise<void> {
  const sender = from || process.env.DEFAULT_FROM_EMAIL!;
  try {
    await sgMail.send({ to, from: sender, subject, text, html });
    console.log("Email successfully sent to", to);
  } catch (error) {
    console.error("SendGrid Error:", error);
    throw error;
  }
}
