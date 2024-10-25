import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Resend } from 'resend';
import { EmailService } from './email.service';

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}));

describe('EmailService', () => {
  let service: EmailService;
  let mockResend: jest.Mocked<Resend>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config = {
                'RESEND_API_KEY': 'test-api-key',
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
    mockResend = (service as any).resend;
  });

  describe('sendLoginLink', () => {
    it('should send login link email', async () => {
      const email = 'test@example.com';
      const token = 'test-token';

      await service.sendLoginLink(email, token);

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        expect.objectContaining({
          to: email,
          subject: 'Your CodeCon Login Link',
          html: expect.stringContaining(token),
        })
      );
    });

    it('should throw error when email sending fails', async () => {
      const email = 'test@example.com';
      const token = 'test-token';
      const errorMessage = 'Failed to send';

      mockResend.emails.send.mockResolvedValueOnce({ 
        data: null, 
        error: { message: errorMessage, name: 'Error', statusCode: 500 } 
      });

      await expect(service.sendLoginLink(email, token))
        .rejects
        .toThrow(`Failed to send login email: ${errorMessage}`);
    });
  });
});
