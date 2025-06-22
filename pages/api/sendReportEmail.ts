import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Configure these in your .env file
const NGO_EMAIL = process.env.NGO_EMAIL || 'ngo@example.com';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const report = req.body;
  if (!report || !report.description) {
    return res.status(400).json({ error: 'Missing report data' });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  // Compose email
  const mailOptions = {
    from: `Safety Support Report <${SMTP_USER}>`,
    to: NGO_EMAIL,
    subject: `New Incident Report: ${report.category || 'No Category'}`,
    text: `A new report has been submitted.\n\n${JSON.stringify(report, null, 2)}`,
    html: `<h2>New Incident Report</h2><pre>${JSON.stringify(report, null, 2)}</pre>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email', details: error });
  }
}
// NOTE: You must add SMTP credentials and NGO_EMAIL to your .env file for this to work in production. 