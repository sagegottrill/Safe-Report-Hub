// Test script for Google Apps Script Webhook
// Replace YOUR_WEBAPP_URL with the URL from Step 4

const WEBAPP_URL = 'YOUR_WEBAPP_URL'; // Replace this with your actual web app URL

async function testWebhook() {
  const testData = {
    category: 'gender_based_violence',
    urgency: 'high',
    message: 'Test report from frontend integration',
    location: 'Test Location',
    isAnonymous: false,
    platform: 'web',
    impact: ['test', 'verification'],
    perpetrator: 'Test Perpetrator',
    date: new Date().toISOString().split('T')[0]
  };

  try {
    const response = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Webhook Response:', result);
    
    if (result.success) {
      console.log('✅ Webhook is working! Report saved successfully.');
      console.log('Report ID:', result.reportId);
    } else {
      console.log('❌ Webhook error:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Test GET request
async function testGet() {
  try {
    const response = await fetch(WEBAPP_URL);
    const result = await response.json();
    console.log('GET Response:', result);
  } catch (error) {
    console.error('GET Error:', error);
  }
}

// Run tests
console.log('Testing webhook...');
testGet();
testWebhook(); 