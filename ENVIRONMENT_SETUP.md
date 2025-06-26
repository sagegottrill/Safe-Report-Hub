# Environment Setup for Real-Time Analytics

## Required Environment Variables

To enable real-time analytics and data submission, you need to set up the following environment variables:

### 1. Google Sheets API Credentials

#### Option A: Using .env file (Recommended)
Create a `.env` file in the root directory with:

```env
# Google Sheets API
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service%40your-project.iam.gserviceaccount.com"}

# Google Sheet ID (from the URL)
SHEET_ID=your-google-sheet-id-here
```

#### Option B: Set in PowerShell (Windows)
```powershell
$env:GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
$env:SHEET_ID='your-google-sheet-id-here'
```

### 2. How to Get Google Sheets API Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in details and create
5. **Generate JSON Key**:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the JSON file
6. **Share Google Sheet**:
   - Open your Google Sheet
   - Click "Share" and add the service account email (from the JSON)
   - Give "Editor" permissions

### 3. Google Sheet Structure

Your Google Sheet should have these columns (in order):
- A: Timestamp
- B: Category/Sector
- C: Description/Message
- D: Urgency
- E: Tags
- F: Location
- G: Anonymous
- H: Sector
- I: Stakeholder
- J: School Name
- K: Community Name
- L: Infrastructure Type
- M: Incident Date

### 4. Testing the Setup

1. **Start the Express server**:
   ```bash
   node server/api-server.js
   ```

2. **Test the health endpoint**:
   ```bash
   curl http://localhost:3001/health
   ```

3. **Test the analytics endpoint**:
   ```bash
   curl http://localhost:3001/analytics
   ```

4. **Submit a test report** via the web interface at `/test-multisectoral`

### 5. Troubleshooting

#### "Missing required parameters: spreadsheetId"
- Check that `SHEET_ID` is set correctly
- Verify the sheet ID from the Google Sheets URL

#### "Invalid private key"
- Ensure the entire JSON key is properly quoted
- Check for line breaks in the private key

#### "Permission denied"
- Make sure the service account email has access to the Google Sheet
- Verify the Google Sheets API is enabled

#### CORS errors
- The Express server includes CORS headers
- If issues persist, check browser console for specific errors

### 6. Development vs Production

#### Development
- Use `.env` file for local development
- Express server runs on `localhost:3001`
- Frontend runs on `localhost:8081`

#### Production
- Set environment variables on your hosting platform
- Update API URLs to production endpoints
- Ensure proper CORS configuration

## Quick Start

1. Set up environment variables
2. Start Express server: `node server/api-server.js`
3. Start frontend: `npm run dev`
4. Visit `/test-multisectoral` to test the system
5. Check `/admin-analytics` and `/community-dashboard` for real-time data 