# Email Setup Guide for BICTDA REPORT

This guide explains how to set up email functionality for the password recovery feature using nodemailer.

## Overview

The application uses nodemailer to send password recovery emails when users request their passwords. The email system is configured through environment variables and supports Gmail and other SMTP providers.

## Features

- ✅ Password recovery emails with professional HTML templates
- ✅ Secure email sending with SSL/TLS
- ✅ Environment-based configuration
- ✅ Error handling and logging
- ✅ Security-conscious responses (prevents password enumeration)

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in your project root and add the following email configuration:

```env
# Email Configuration (for password recovery)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_SERVICE=gmail

# SMTP Configuration (for report emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NGO_EMAIL=ngo@example.com
```

### 2. Gmail Setup (Recommended)

#### Option A: App Password (Recommended for 2FA accounts)

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use this app password as `EMAIL_PASSWORD`

#### Option B: Less Secure App Access (Not recommended)

1. Go to your Google Account settings
2. Navigate to Security → Less secure app access
3. Turn on "Allow less secure apps"
4. Use your regular Gmail password as `EMAIL_PASSWORD`

### 3. Other Email Providers

For other email providers, update the configuration:

```env
EMAIL_SERVICE=outlook  # or yahoo, hotmail, etc.
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

Or use custom SMTP settings:

```env
EMAIL_SERVICE=custom
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your-email@your-provider.com
EMAIL_PASSWORD=your-password
```

## Testing the Setup

### 1. Run the Test Script

```bash
node test-email.js
```

This script will:
- Check your environment configuration
- Verify the email connection
- Test the transporter setup

### 2. Test in the Application

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click "Forgot Password?"
4. Enter a valid email address
5. Check if the email is received

## API Endpoints

### Password Recovery Email

**Endpoint:** `POST /api/sendPasswordEmail`

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "BICTDA REPORT password recovery",
  "body": "Here is your password: 123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password recovery email sent successfully",
  "messageId": "message-id-here"
}
```

## Security Features

- **Password Enumeration Protection**: Always returns success response to prevent attackers from determining if an email exists
- **Secure Configuration**: Email credentials are stored in environment variables
- **SSL/TLS**: All emails are sent over encrypted connections
- **Input Validation**: Email addresses and content are validated before sending
- **Error Logging**: Detailed error logging for debugging without exposing sensitive data

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check your email and password
   - For Gmail, use an App Password if 2FA is enabled
   - Ensure "Less secure app access" is enabled if not using App Password

2. **"Connection timeout"**
   - Check your internet connection
   - Verify the SMTP host and port settings
   - Check firewall settings

3. **"Email not received"**
   - Check spam/junk folder
   - Verify the recipient email address
   - Check email provider's sending limits

4. **"Environment variables not found"**
   - Ensure `.env` file exists in project root
   - Restart your development server after adding environment variables
   - Check variable names for typos

### Debug Mode

To enable debug logging, add this to your `.env` file:

```env
DEBUG=nodemailer:*
```

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel dashboard
2. Ensure all email configuration variables are set
3. Test the email functionality after deployment

### Other Platforms

- **Netlify**: Add environment variables in site settings
- **Railway**: Add environment variables in project settings
- **Heroku**: Use `heroku config:set` command

## Email Templates

The password recovery email uses a professional HTML template with:
- BICTDA REPORT branding
- Clear password display
- Security notices
- Responsive design
- Professional styling

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the error logs in your console
3. Test with the provided test script
4. Verify your email provider's SMTP settings

## Files Modified

- `pages/api/sendPasswordEmail.ts` - Main email sending API
- `src/contexts/AppContext.tsx` - Password recovery logic
- `src/components/auth/LoginForm.tsx` - Forgot password UI
- `env.example` - Environment configuration template
- `test-email.js` - Email testing script
- `EMAIL_SETUP.md` - This documentation 