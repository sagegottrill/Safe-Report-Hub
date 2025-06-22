import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const {
    category,
    urgency,
    message,
    location,
    anonymous,
    tags,
  } = req.body;

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY || !process.env.SHEET_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'ID!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          new Date().toISOString(),
          category,
          message,
          urgency,
          tags,
          location,
          anonymous,
        ]],
      },
    });

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Sheet write failed:', error);
    return res.status(500).json({ error: 'Sheet write failed', detail: error.message });
  }
} 