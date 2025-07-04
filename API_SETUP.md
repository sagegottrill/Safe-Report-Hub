# API Integration Setup Guide

## ✅ Frontend Connected to API

Your frontend form is now connected to the `/api/report` endpoint with the exact structure you specified:

```typescript
await fetch("/api/report", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    category,
    urgency,
    message,
    location,
    anonymous,
    tags: autoGeneratedTags,
  }),
});
```

## 🚀 How to Run

### Option 1: Full Development (Recommended)
```bash
npm run dev:full
```
This runs both:
- Frontend (Vite) on port 8080
- API Server (Express) on port 3001

### Option 2: Separate Development
```bash
# Terminal 1 - API Server
npm run api

# Terminal 2 - Frontend
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"your-service@your-project.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/your-service%40your-project.iam.gserviceaccount.com"}
SHEET_ID=your_google_sheet_id_here
```

## 📊 Data Flow

1. **User submits form** → Frontend sends data to `/api/report`
2. **Vite proxy** → Routes request to Express server (port 3001)
3. **Express server** → Processes data and sends to Google Sheets
4. **Google Sheets** → Stores the report data
5. **Fallback** → If API fails, falls back to Google Apps Script webhook

## 🔄 API Endpoints

- `POST /api/report` - Submit new report
- `GET /health` - API health check

## 🛡️ Error Handling

- ✅ API failure → Falls back to Google Apps Script webhook
- ✅ Both fail → Stores locally and syncs when online
- ✅ Offline → Stores in IndexedDB, syncs when back online

## 🎯 Success Indicators

When a report is successfully submitted, you'll see:
- ✅ "Report submitted successfully and saved to Google Sheets"
- ✅ Data appears in your Google Sheet
- ✅ Local system also stores the report

## 🔍 Testing

1. Start the servers: `npm run dev:full`
2. Open http://localhost:8080
3. Submit a test report
4. Check your Google Sheet for new data
5. Check browser console for any errors

## 🚨 Troubleshooting

### API Server Not Starting
- Check if port 3001 is available
- Verify environment variables are set
- Check console for error messages

### Google Sheets Not Updating
- Verify service account has edit permissions
- Check SHEET_ID is correct
- Verify GOOGLE_SERVICE_ACCOUNT_KEY is valid JSON

### Frontend Can't Connect
- Ensure API server is running on port 3001
- Check Vite proxy configuration
- Verify no CORS issues 