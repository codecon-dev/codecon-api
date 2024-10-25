import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as nodemailer from 'nodemailer';
import { EmailService } from './email.service';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: any;

  beforeEach(async () => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue(true),
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                'SMTP_HOST': 'smtp.example.com',
                'SMTP_PORT': 587,
                'SMTP_USER': 'user',
                'SMTP_PASS': 'pass',
                'SMTP_FROM': 'noreply@example.com',
                'APP_URL': 'http://localhost:3000',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  describe('sendLoginLink', () => {
    it('should send login link email', async () => {
      const email = 'test@example.com';
      const token = 'test-token';

      await service.sendLoginLink(email, token);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: 'Your CodeCon Login Link',
          html: expect.stringContaining(token),
        })
      );
    });
  });
});
