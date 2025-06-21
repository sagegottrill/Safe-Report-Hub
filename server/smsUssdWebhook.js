const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Africa's Talking config (replace with your keys)
const africastalking = require('africastalking')({
  apiKey: 'YOUR_AT_API_KEY',
  username: 'YOUR_AT_USERNAME'
});
const sms = africastalking.SMS;

// Add Vercel Edge Config import
const { get } = require('@vercel/edge-config');

// --- Greeting Endpoint ---
app.get('/greeting', async (req, res) => {
  try {
    const greeting = await get('greeting');
    res.json({ greeting });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch greeting from Edge Config.' });
  }
});

// --- SMS Webhook ---
app.post('/sms', (req, res) => {
  const { text, from } = req.body;
  // Example: "REPORT GBV CRITICAL Maiduguri Woman attacked at market, needs help."
  const match = text.match(/^REPORT\s+(\w+)\s+(\w+)\s+(\w+)\s+(.+)/i);
  if (!match) {
    // Optionally send error SMS back
    sms.send({
      to: [from],
      message: 'Invalid format. Use: REPORT [Category] [Urgency] [Location] [Description]'
    });
    return res.send('Invalid format');
  }
  const [, category, urgency, location, description] = match;
  // Save to DB (pseudo-code)
  saveReport({
    type: category,
    urgency,
    region: location,
    description,
    platform: 'SMS',
    isAnonymous: true,
    status: 'new',
    flagged: true,
    reporterPhone: from,
    date: new Date().toISOString(),
  });
  // Confirmation SMS
  sms.send({
    to: [from],
    message: 'Report received. Thank you.'
  });
  res.send('Report received');
});

// --- USSD Webhook ---
app.post('/ussd', (req, res) => {
  const { text, sessionId, phoneNumber } = req.body;
  let response = '';
  const steps = text.split('*');
  switch (steps.length) {
    case 1:
      response = 'CON Select category:\n1. GBV\n2. CP\n3. FD\n4. FI\n5. WS\n6. SH\n7. HE';
      break;
    case 2:
      response = 'CON Urgency:\n1. Low\n2. Medium\n3. Critical';
      break;
    case 3:
      response = 'CON Enter location:';
      break;
    case 4:
      response = 'CON Enter description:';
      break;
    case 5:
      // Map input to fields
      const categories = ['GBV', 'CP', 'FD', 'FI', 'WS', 'SH', 'HE'];
      const urgencies = ['Low', 'Medium', 'Critical'];
      const report = {
        type: categories[parseInt(steps[1]) - 1] || 'Unknown',
        urgency: urgencies[parseInt(steps[2]) - 1] || 'Unknown',
        region: steps[3],
        description: steps[4],
        platform: 'USSD',
        isAnonymous: true,
        status: 'new',
        flagged: true,
        reporterPhone: phoneNumber,
        date: new Date().toISOString(),
      };
      saveReport(report);
      response = 'END Report received. Thank you.';
      break;
    default:
      response = 'END Invalid input.';
  }
  res.set('Content-Type: text/plain');
  res.send(response);
});

// --- Dummy DB save function (replace with real DB logic) ---
function saveReport(report) {
  // TODO: Save to your database and trigger sync/flag for admin
  console.log('New report:', report);
}

app.listen(3001, () => console.log('Africa\'s Talking SMS/USSD webhook running on port 3001')); 