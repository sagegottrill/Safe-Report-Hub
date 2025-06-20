# Africa's Talking SMS/USSD Integration

This backend server enables SMS and USSD reporting for your humanitarian app using Africa's Talking.

## Features
- Receive SMS and USSD reports from users (even offline)
- Map incoming messages to internal report fields
- Auto-flag for admin review
- Ready for integration with your main app's database

## Setup

1. **Install dependencies:**
   ```sh
   npm install express body-parser africastalking
   ```

2. **Configure Africa's Talking credentials:**
   - Edit `server/smsUssdWebhook.js` and set your `apiKey` and `username`:
     ```js
     const africastalking = require('africastalking')({
       apiKey: 'YOUR_AT_API_KEY',
       username: 'YOUR_AT_USERNAME'
     });
     ```

3. **Run the server:**
   ```sh
   node server/smsUssdWebhook.js
   ```
   The server will listen on port 3001 by default.

4. **Set webhook URLs in Africa's Talking dashboard:**
   - SMS: `https://yourdomain.com/sms`
   - USSD: `https://yourdomain.com/ussd`

5. **Integrate with your database:**
   - Replace the `saveReport` function in `smsUssdWebhook.js` with your real DB logic.

## SMS Format
```
REPORT [Category] [Urgency] [Location] [Description]
Example:
REPORT GBV CRITICAL Maiduguri Woman attacked at market, needs help.
```

## USSD Flow
- Step-by-step menu for category, urgency, location, and description.

## Security
- Use HTTPS for webhooks in production.
- Validate incoming requests (see Africa's Talking docs).

## Support
- See Africa's Talking docs: https://developers.africastalking.com/
- For integration help, contact your developer. 