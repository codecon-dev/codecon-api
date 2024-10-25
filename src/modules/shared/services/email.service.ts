import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendLoginLink(email: string, token: string): Promise<void> {
    const loginUrl = `${this.configService.get('APP_URL')}/auth/verify?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Your CodeCon Login Link',
      html: `
        <p>Click the link below to log in to CodeCon:</p>
        <p><a href="${loginUrl}">${loginUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });
  }
}
