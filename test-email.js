import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test email configuration
async function testEmail() {
  console.log('Testing email configuration...');
  
  // Check environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  console.log('Email configuration:');
  console.log('- Service:', emailService);
  console.log('- User:', emailUser ? '✓ Set' : '✗ Missing');
  console.log('- Password:', emailPassword ? '✓ Set' : '✗ Missing');
  
  if (!emailUser || !emailPassword) {
    console.log('\n❌ Email configuration incomplete. Please set EMAIL_USER and EMAIL_PASSWORD in your .env file.');
    console.log('\nExample .env configuration:');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_PASSWORD=your-app-password');
    console.log('EMAIL_SERVICE=gmail');
    return;
  }
  
  try {
    // Create test transporter
    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection
    console.log('\n🔍 Verifying email connection...');
    await transporter.verify();
    console.log('✅ Email connection verified successfully!');
    
    // Test email sending (enabled)
    console.log('\n📧 Sending test email...');
    const testMailOptions = {
      from: `"BICTDA REPORT Test" <${emailUser}>`,
      to: emailUser, // Send to yourself for testing
      subject: 'Test Email - BICTDA REPORT',
      text: 'This is a test email from BICTDA REPORT system.',
      html: '<h2>Test Email</h2><p>This is a test email from BICTDA REPORT system.</p>'
    };
    
    const info = await transporter.sendMail(testMailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    console.log('\n🎉 Email configuration is working correctly!');
    console.log('You can now use the password recovery feature.');
    console.log('\nNext steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Go to the login page');
    console.log('3. Click "Forgot Password?"');
    console.log('4. Test with a valid email address');
    
  } catch (error) {
    console.error('\n❌ Email configuration error:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('1. Make sure EMAIL_USER and EMAIL_PASSWORD are set in .env file');
    console.log('2. For Gmail, use an App Password instead of your regular password');
    console.log('3. Enable "Less secure app access" or use 2FA with App Password');
    console.log('4. Check your email service settings');
    console.log('\nFor detailed setup instructions, see EMAIL_SETUP.md');
  }
}

// Run the test
testEmail(); 