import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, html: string) => {
  const EMAIL_SERVICE_PROVIDER = process.env.EMAIL_SERVICE_PROVIDER;
  const EMAIL_APP_USER = process.env.EMAIL_APP_USER;
  const EMAIL_APP_PASS = process.env.EMAIL_APP_PASS;

  // Validate environment variables
  if (!EMAIL_SERVICE_PROVIDER || !EMAIL_APP_USER || !EMAIL_APP_PASS) {
    console.error('Missing email configuration in environment variables.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE_PROVIDER,
    auth: {
      user: EMAIL_APP_USER, // Your email
      pass: EMAIL_APP_PASS, // Your password or app-specific password
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_APP_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
};
