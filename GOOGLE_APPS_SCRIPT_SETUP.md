# Google Apps Script Webhook Setup

This guide will help you set up the Google Apps Script webhook to save report data to a Google Sheet.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name the first sheet "Reports" (or any name you prefer)
4. The script will automatically add headers if the sheet is empty

## Step 2: Create Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `google-apps-script-webhook.js`
4. Save the project with a name like "Safety Support Report Webhook"

## Step 3: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following options:
   - **Execute as**: "Me" (your Google account)
   - **Who has access**: "Anyone" (for anonymous access)
4. Click "Deploy"
5. Copy the generated web app URL

## Step 4: Update React App

1. Open `src/components/report/ReportForm.tsx`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE` with your actual web app URL
3. The URL should look like: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`

## Step 5: Test the Integration

1. Start your React app
2. Submit a test report
3. Check your Google Sheet to see if the data appears
4. Check the browser console for any errors

## Data Structure

The webhook will save the following data to your Google Sheet:

| Column | Description |
|--------|-------------|
| Timestamp | When the report was received |
| Category | Report category (e.g., gender_based_violence) |
| Urgency | Low/Medium/Critical |
| Description | Detailed description of the incident |
| Location | Geographic coordinates or location name |
| Anonymous | Yes/No |
| Auto Tags | Automatically generated tags based on content |
| Report Timestamp | When the incident occurred |
| Latitude | GPS latitude |
| Longitude | GPS longitude |
| Platform | Where the incident occurred (e.g., Instagram) |
| Impact | Selected impact options |
| Perpetrator | Alleged perpetrator information |
| Incident Date | Date of the incident |
| Client-Generated Tags | Tags generated from the client based on keywords |

## Auto-Generated Tags

The system automatically generates tags based on:
- **Category**: GBV, Child, Displacement, Food, Water, Shelter, Health
- **Content Analysis (Client-side)**: Keywords like "rape", "abuse", "violence", "hunger", "sick", "homeless", etc.
- **Content Analysis (Server-side)**: Keywords like "urgent", "emergency", "child", etc.
- **Impact Assessment**: Based on selected impact options

## Error Handling

- If the webhook fails, reports are still saved locally
- Offline reports are queued and synced when online
- Error messages are logged to the browser console
- Users receive appropriate feedback via toast notifications

## Security Considerations

- The webhook accepts anonymous submissions
- Consider adding authentication if needed
- Monitor your Google Sheet for unusual activity
- Regularly backup your data

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your Google Apps Script is deployed as a web app with "Anyone" access
2. **404 Errors**: Verify the webhook URL is correct
3. **Permission Errors**: Ensure the script has permission to access your Google Sheet
4. **Data Not Appearing**: Check if the sheet name matches "Reports" or update the script

### Testing the Webhook:

You can test the webhook directly by visiting the URL in your browser. It should return:
```json
{
  "message": "Safety Support Report Webhook is running",
  "status": "active"
}
```

## Advanced Configuration

### Customizing Auto Tags

Edit the `generateAutoTags` function in the Google Apps Script to add more sophisticated tag generation logic.

### Adding Authentication

If you need authentication, modify the `doPost` function to validate API keys or tokens.

### Custom Sheet Structure

Modify the `setupSheet` function to change the column headers and structure of your Google Sheet. 