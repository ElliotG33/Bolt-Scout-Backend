import nodemailer from 'nodemailer';
// import dotenv from 'dotenv'; // Import

// Load environment variables
// dotenv.config();

export const sendEmail = async (to: string, subject: string, html: string) => {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const SMTP_PORT = process.env.SMTP_PORT;
  const APP_URL = process.env.APP_URL || 'localhost';

  // Validate environment variables
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Missing email configuration in environment variables.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: SMTP_PORT ? true : false,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: 'info@scout-ai.org',
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email: ${error}`);
  }
};
