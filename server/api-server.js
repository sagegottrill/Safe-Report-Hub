import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
const DEFAULT_PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Analytics endpoint - GET dashboard data
app.get('/analytics', async (req, res) => {
  try {
    console.log('Fetching analytics data...');

    // Load the service account credentials from env
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SHEET_ID;

    // Read all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:N', // Read columns A to N to include new fields
    });

    const rows = response.data.values || [];
    
    // Skip header row if it exists
    const dataRows = rows.length > 0 && rows[0][0] === 'Timestamp' ? rows.slice(1) : rows;
    
    console.log(`Processing ${dataRows.length} reports for analytics...`);

    // Initialize counters
    const analytics = {
      totalReports: dataRows.length,
      gbvReports: 0,
      educationReports: 0,
      waterReports: 0,
      urgentReports: 0,
      recentReports: 0,
      anonymousReports: 0,
      followUpRequired: 0,
      sectorData: {
        gbv: {
          sector: 'GBV',
          count: 0,
          urgent: 0,
          anonymous: 0,
          categories: {},
          trends: []
        },
        education: {
          sector: 'Education',
          count: 0,
          urgent: 0,
          anonymous: 0,
          categories: {},
          trends: []
        },
        water: {
          sector: 'Water',
          count: 0,
          urgent: 0,
          anonymous: 0,
          categories: {},
          trends: []
        }
      },
      trends: [],
      recentActivity: []
    };

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Process each row
    dataRows.forEach((row, index) => {
      if (row.length < 7) return; // Skip incomplete rows

      const [timestamp, category, message, urgency, tags, location, anonymous, sector, stakeholder, schoolName, communityName, infrastructureType, incidentDate] = row;
      const reportDate = new Date(timestamp);
      
      // Determine sector from explicit sector field or category
      let reportSector = 'other';
      if (sector && typeof sector === 'string') {
        const sectorLower = sector.toLowerCase();
        if (sectorLower === 'gbv' || sectorLower === 'gender-based violence') {
          reportSector = 'gbv';
        } else if (sectorLower === 'education') {
          reportSector = 'education';
        } else if (sectorLower === 'water' || sectorLower === 'water & infrastructure') {
          reportSector = 'water';
        }
      } else if (category && typeof category === 'string') {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('domestic') || categoryLower.includes('sexual') || 
            categoryLower.includes('abuse') || categoryLower.includes('harassment') ||
            categoryLower.includes('gbv') || categoryLower.includes('violence')) {
          reportSector = 'gbv';
        } else if (categoryLower.includes('school') || categoryLower.includes('education') ||
                   categoryLower.includes('teacher') || categoryLower.includes('student') ||
                   categoryLower.includes('bully')) {
          reportSector = 'education';
        } else if (categoryLower.includes('water') || categoryLower.includes('infrastructure') ||
                   categoryLower.includes('borehole') || categoryLower.includes('well') ||
                   categoryLower.includes('pump')) {
          reportSector = 'water';
        }
      }

      // Count by sector
      if (reportSector === 'gbv') {
        analytics.gbvReports++;
        analytics.sectorData.gbv.count++;
        if (urgency === 'high' || urgency === 'critical') analytics.sectorData.gbv.urgent++;
        if (anonymous === 'true') analytics.sectorData.gbv.anonymous++;
        analytics.sectorData.gbv.categories[category] = (analytics.sectorData.gbv.categories[category] || 0) + 1;
      } else if (reportSector === 'education') {
        analytics.educationReports++;
        analytics.sectorData.education.count++;
        if (urgency === 'high' || urgency === 'critical') analytics.sectorData.education.urgent++;
        if (anonymous === 'true') analytics.sectorData.education.anonymous++;
        analytics.sectorData.education.categories[category] = (analytics.sectorData.education.categories[category] || 0) + 1;
      } else if (reportSector === 'water') {
        analytics.waterReports++;
        analytics.sectorData.water.count++;
        if (urgency === 'high' || urgency === 'critical') analytics.sectorData.water.urgent++;
        if (anonymous === 'true') analytics.sectorData.water.anonymous++;
        analytics.sectorData.water.categories[category] = (analytics.sectorData.water.categories[category] || 0) + 1;
      }

      // Count urgent reports
      if (urgency === 'high' || urgency === 'critical') {
        analytics.urgentReports++;
      }

      // Count recent reports (last 24 hours)
      if (reportDate > oneDayAgo) {
        analytics.recentReports++;
      }

      // Count anonymous reports
      if (anonymous === 'true') {
        analytics.anonymousReports++;
      }

      // Add to recent activity (last 10 reports)
      if (analytics.recentActivity.length < 10) {
        analytics.recentActivity.push({
          id: index + 1,
          sector: reportSector.toUpperCase(),
          category,
          urgency,
          time: reportDate.toISOString(),
          timestamp: reportDate
        });
      }

      // Add to trends (last 7 days)
      if (reportDate > sevenDaysAgo) {
        const dateKey = reportDate.toISOString().split('T')[0];
        const existingTrend = analytics.trends.find(t => t.date === dateKey);
        if (existingTrend) {
          existingTrend.count++;
        } else {
          analytics.trends.push({ date: dateKey, count: 1 });
        }
      }
    });

    // Sort trends by date
    analytics.trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate follow-up required (reports with high urgency or recent reports)
    analytics.followUpRequired = analytics.urgentReports + Math.floor(analytics.recentReports * 0.3);

    // Add trend data to each sector
    Object.keys(analytics.sectorData).forEach(sectorKey => {
      const sector = analytics.sectorData[sectorKey];
      sector.trends = analytics.trends.map(trend => {
        // Count reports for this sector on this specific date
        const sectorCount = dataRows.filter(row => {
          const rowDate = new Date(row[0]); // Assuming timestamp is first column
          const rowDateKey = rowDate.toISOString().split('T')[0];
          const rowSector = row[7]?.toLowerCase() || row[1]?.toLowerCase() || ''; // sector column or category column
          
          return rowDateKey === trend.date && 
                 ((sectorKey === 'gbv' && (rowSector.includes('gbv') || rowSector.includes('gender') || rowSector.includes('violence'))) ||
                  (sectorKey === 'education' && rowSector.includes('education')) ||
                  (sectorKey === 'water' && (rowSector.includes('water') || rowSector.includes('infrastructure'))));
        }).length;
        
        return {
          date: trend.date,
          count: sectorCount
        };
      });
    });

    console.log('Analytics data processed successfully');
    res.status(200).json(analytics);
  } catch (err) {
    console.error('Analytics API Error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics data', details: err.message });
  }
});

// Google Sheets API handler
app.post('/report', async (req, res) => {
  try {
    const {
      sector,
      category,
      urgency,
      message,
      location,
      anonymous,
      tags,
      incidentDate,
      description,
      stakeholder,
      schoolName,
      communityName,
      infrastructureType,
    } = req.body;

    console.log('Received report data:', { 
      sector, category, urgency, message, location, anonymous, 
      stakeholder, schoolName, communityName, infrastructureType 
    });

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
          category || sector,
          description || message,
          urgency,
          tags,
          location,
          anonymous,
          sector,
          stakeholder,
          schoolName,
          communityName,
          infrastructureType,
          incidentDate
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
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  res.json({ status: 'ok' });
});

// Function to start server with port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`API Server running on port ${port}`);
    console.log('Environment check:');
    console.log('- GOOGLE_SERVICE_ACCOUNT_KEY:', process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Not set');
    console.log('- SHEET_ID:', process.env.SHEET_ID ? 'Set' : 'Not set');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(DEFAULT_PORT); 