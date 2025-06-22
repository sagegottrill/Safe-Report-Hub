import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets API handler
app.post('/report', async (req, res) => {
  try {
    const {
      category,
      urgency,
      message,
      location,
      anonymous,
      tags,
    } = req.body;

    console.log('Received report data:', { category, urgency, message, location, anonymous, tags });

    // Load the service account credentials from env
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.SHEET_ID;
    const range = 'Sheet1!A1'; // Start appending from A1

    console.log('Attempting to write to Google Sheets...');

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

    console.log('Successfully wrote to Google Sheets');
    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Failed to write to sheet', details: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Not set');
  console.log('- SHEET_ID:', process.env.SHEET_ID ? 'Set' : 'Not set');
}); 