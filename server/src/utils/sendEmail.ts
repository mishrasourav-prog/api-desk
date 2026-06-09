import { Resend } from "resend";

export async function sendOTPEmail(
  email: string,
  otp: string
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY missing");
  }

  const resend = new Resend(apiKey);

  await resend.emails.send({
    from:"api-desk <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
    `,
  });
}