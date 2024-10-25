import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
  }

  async sendLoginLink(email: string, token: string): Promise<void> {
    const loginUrl = `${this.configService.get('APP_URL')}/auth/verify?token=${token}`;

    const { error } = await this.resend.emails.send({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Your CodeCon Login Link',
      html: `
        <p>Click the link below to log in to CodeCon:</p>
        <p><a href="${loginUrl}">${loginUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    if (error) {
      throw new Error(`Failed to send login email: ${error.message}`);
    }
  }

  async sendRegistrationLink(email: string, token: string): Promise<void> {
    const registrationUrl = `${this.configService.get('APP_URL')}/auth/register/verify?token=${token}`;

    const { error } = await this.resend.emails.send({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Complete Your CodeCon Registration',
      html: `
        <p>Click the link below to complete your registration for CodeCon:</p>
        <p><a href="${registrationUrl}">${registrationUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    if (error) {
      throw new Error(`Failed to send registration email: ${error.message}`);
    }
  }
}
