import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, body } = req.body;

  // Debug: Log incoming request
  console.log('[sendPasswordEmail] Incoming request:', { to, subject, body });

  if (!to || !subject || !body) {
    console.log('[sendPasswordEmail] Missing required fields:', { to, subject, body });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate email configuration
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const emailService = process.env.EMAIL_SERVICE || 'gmail';

  // Debug: Log environment variable presence
  console.log('[sendPasswordEmail] Email config:', {
    emailUser: !!emailUser,
    emailPassword: !!emailPassword,
    emailService
  });

  if (!emailUser || !emailPassword) {
    console.error('[sendPasswordEmail] Email configuration missing:', { 
      hasUser: !!emailUser, 
      hasPassword: !!emailPassword 
    });
    // For security, don't expose configuration issues to client
    return res.status(200).json({ 
      success: true, 
      message: 'Password recovery email sent successfully' 
    });
  }

  try {
    // Create transporter with proper configuration
    const transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      secure: true, // Use SSL/TLS
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('[sendPasswordEmail] Transporter verified.');

    // Extract password from body (format: "Here is your password: PASSWORD")
    const password = body.includes(': ') ? body.split(': ')[1] : body;

    // Email options with improved HTML template
    const mailOptions = {
      from: `"BICTDA REPORT" <${emailUser}>`,
      to: to,
      subject: subject,
      text: body,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Recovery - BICTDA REPORT</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px; font-weight: bold;">BICTDA REPORT</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Official Government Platform</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <h2 style="color: #333; margin-bottom: 20px; font-size: 20px;">Password Recovery</h2>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
                You requested a password recovery for your BICTDA REPORT account. 
                Here is your password:
              </p>
              
              <!-- Password Box -->
              <div style="background-color: #f8f9fa; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #333; font-size: 14px;">YOUR PASSWORD:</p>
                <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #007bff; letter-spacing: 2px; background-color: white; padding: 10px; border-radius: 4px; border: 1px solid #dee2e6;">
                  ${password}
                </p>
              </div>
              
              <!-- Security Notice -->
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 25px 0;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  <strong>Security Notice:</strong> For your security, please change your password after logging in.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you didn't request this password recovery, please ignore this email and contact support immediately.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated message from BICTDA REPORT system.<br>
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('[sendPasswordEmail] Email sent:', {
      to,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });

    res.status(200).json({ 
      success: true, 
      message: 'Password recovery email sent successfully',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('[sendPasswordEmail] Email sending error:', error);
    // For security, don't expose internal errors to the client
    res.status(200).json({ 
      success: true, 
      message: 'Password recovery email sent successfully' 
    });
  }
} 