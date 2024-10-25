import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../shared/services/email.service';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';

describe('AuthService - Email Registration', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let emailService: EmailService;

  const mockEmail = 'test@example.com';
  const mockName = 'Test User';
  const mockToken = 'valid-token';
  const mockJwtToken = 'jwt-token';
  const mockUserId = 'user-id';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendRegistrationLink: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  describe('registerWithEmail', () => {
    it('should send registration link for new email', async () => {
      // Arrange
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      // Act
      await authService.registerWithEmail(mockEmail);

      // Assert
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailService.sendRegistrationLink).toHaveBeenCalledWith(
        mockEmail,
        expect.any(String)
      );
    });

    it('should not send registration link if email exists', async () => {
      // Arrange
      const existingUser = { id: mockUserId, email: mockEmail };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      // Act
      await authService.registerWithEmail(mockEmail);

      // Assert
      expect(usersService.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(emailService.sendRegistrationLink).not.toHaveBeenCalled();
    });
  });

  describe('completeRegistration', () => {
    beforeEach(() => {
      // Setup valid registration token
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15);
      (authService as any).otpTokens.set(mockToken, {
        email: mockEmail,
        expires,
        type: 'registration'
      });
    });

    it('should complete registration with valid token', async () => {
      // Arrange
      const expectedUser = { id: mockUserId, email: mockEmail, name: mockName };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue(expectedUser);
      (jwtService.sign as jest.Mock).mockReturnValue(mockJwtToken);

      // Act
      const result = await authService.completeRegistration(mockToken, mockName);

      // Assert
      expect(result).toEqual({ access_token: mockJwtToken });
      expect(usersService.create).toHaveBeenCalledWith({
        email: mockEmail,
        name: mockName,
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: expectedUser.id });
      expect((authService as any).otpTokens.has(mockToken)).toBeFalsy();
    });

    it('should throw UnauthorizedException for expired token', async () => {
      // Arrange
      const expiredToken = 'expired-token';
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() - 1);
      (authService as any).otpTokens.set(expiredToken, {
        email: mockEmail,
        expires,
        type: 'registration'
      });

      // Act & Assert
      await expect(authService.completeRegistration(expiredToken, mockName))
        .rejects
        .toThrow(UnauthorizedException);
      expect(usersService.create).not.toHaveBeenCalled();
      expect((authService as any).otpTokens.has(expiredToken)).toBeFalsy();
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange
      const invalidToken = 'invalid-token';

      // Act & Assert
      await expect(authService.completeRegistration(invalidToken, mockName))
        .rejects
        .toThrow(UnauthorizedException);
      expect(usersService.create).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for login token type', async () => {
      // Arrange
      const loginToken = 'login-token';
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15);
      (authService as any).otpTokens.set(loginToken, {
        email: mockEmail,
        expires,
        type: 'login'
      });

      // Act & Assert
      await expect(authService.completeRegistration(loginToken, mockName))
        .rejects
        .toThrow(UnauthorizedException);
      expect(usersService.create).not.toHaveBeenCalled();
      expect((authService as any).otpTokens.has(loginToken)).toBeFalsy();
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      const existingUser = { id: mockUserId, email: mockEmail };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(existingUser);

      // Act & Assert
      await expect(authService.completeRegistration(mockToken, mockName))
        .rejects
        .toThrow(ConflictException);
      expect(usersService.create).not.toHaveBeenCalled();
      expect((authService as any).otpTokens.has(mockToken)).toBeFalsy();
    });
  });
});
