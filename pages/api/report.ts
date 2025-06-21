import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const {
    category,
    urgency,
    message,
    location,
    anonymous,
    tags,
  } = req.body;

  // Load the service account credentials from env
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.SHEET_ID!;
  const range = 'Sheet1!A1'; // Start appending from A1

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          new Date().toISOString(),
          category,
          message,
          urgency,
          tags,
          location,
          anonymous
        ]]
      },
    });

    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to write to sheet' });
  }
} 