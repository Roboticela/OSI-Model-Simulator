import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { TransportOptions } from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST || 'smtp.example.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true';
    const user = process.env.SMTP_USER || 'your-email@example.com';
    const pass = process.env.SMTP_PASSWORD || 'your-password';

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      }
    } as TransportOptions);

    const mailOptions = {
      from: process.env.SMTP_FROM || 'OSI Model Simulator <noreply@roboticela.com>',
      to: process.env.CONTACT_EMAIL || 'team@roboticela.com',
      subject: `Contact Form: Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .email-container {
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .email-header {
              background: linear-gradient(135deg, #4f46e5, #7c3aed);
              color: white;
              padding: 20px;
              text-align: center;
            }
            .email-header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .email-body {
              padding: 20px;
            }
            .contact-info {
              background-color: #f9fafb;
              border-radius: 6px;
              padding: 15px;
              margin-bottom: 20px;
            }
            .contact-info p {
              margin: 8px 0;
            }
            .message-content {
              background-color: #f0f4f8;
              border-left: 4px solid #4f46e5;
              padding: 15px;
              border-radius: 4px;
            }
            .email-footer {
              text-align: center;
              padding: 15px;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
            }
            .label {
              font-weight: 600;
              color: #4b5563;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="email-body">
              <div class="contact-info">
                <p><span class="label">Name:</span> ${name}</p>
                <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
              </div>
              <div class="message-content">
                <p><span class="label">Message:</span></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="email-footer">
              <p>This message was sent from the OSI Model Simulator contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.verify();
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true });
    } catch {
      try {
        const secureTransporter = nodemailer.createTransport({
          host,
          port: 465,
          secure: true,
          auth: {
            user,
            pass,
          },
          tls: {
            rejectUnauthorized: false
          }
        } as TransportOptions);
        
        await secureTransporter.verify();
        
        await secureTransporter.sendMail(mailOptions);
        return NextResponse.json({ success: true });
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 