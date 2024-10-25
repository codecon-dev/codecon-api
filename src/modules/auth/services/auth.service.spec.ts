import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../shared/services/email.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { AuthMethod, User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    authMethods: ['password' as AuthMethod],
  };

  const mockAuthResponse = {
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
    expiresIn: 3600,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendRegistrationLink: jest.fn(),
            sendLoginLink: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    emailService = module.get(EmailService);

    // Setup default JWT mock responses
    jwtService.signAsync.mockImplementation((payload: { sub?: string; type?: string }) =>
      Promise.resolve(payload.type === 'refresh' ? 'mockRefreshToken' : 'mockAccessToken')
    );
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      // Act
      const result = await service.register(createUserDto);

      // Assert
      expect(result).toEqual(mockUser);
      expect(usersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
        authMethods: ['password'],
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await service.validateUser('test@example.com', 'password123');

      // Assert
      const { password, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });

    it('should return null if user not found', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(null);

      // Act
      const result = await service.validateUser('test@example.com', 'password123');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.validateUser('test@example.com', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('loginSocial', () => {
    const socialUserData = {
      email: 'test@example.com',
      name: 'Test User',
      provider: 'google' as AuthMethod,
      providerId: '12345',
    };

    it('should update existing user with new auth method', async () => {
      // Arrange
      const existingUser: User = {
        ...mockUser,
        authMethods: ['password' as AuthMethod]
      };
      const updatedUser: User = {
        ...existingUser,
        authMethods: ['password' as AuthMethod, 'google' as AuthMethod]
      };

      usersService.findByEmail.mockResolvedValue(existingUser);
      usersService.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.loginSocial(socialUserData);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(usersService.update).toHaveBeenCalledWith(existingUser.id, {
        authMethods: ['password' as AuthMethod, 'google' as AuthMethod],
        provider: 'google',
        providerId: '12345',
      });
    });

    it('should create new user if not exists', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(mockUser);

      // Act
      const result = await service.loginSocial(socialUserData);

      // Assert
      expect(result).toEqual(mockAuthResponse);
      expect(usersService.create).toHaveBeenCalledWith({
        email: socialUserData.email,
        name: socialUserData.name,
        provider: socialUserData.provider,
        providerId: socialUserData.providerId,
        authMethods: [socialUserData.provider],
      });
    });
  });

  describe('verifyLoginToken', () => {
    it('should verify valid login token and return auth response', async () => {
      // Arrange
      const token = 'valid-token';
      const payload = { email: 'test@example.com', type: 'magic-link' };
      jwtService.verifyAsync.mockResolvedValue(payload);
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.update.mockResolvedValue({
        ...mockUser,
        authMethods: ['password' as AuthMethod, 'magic-link' as AuthMethod]
      });

      // Act
      const result = await service.verifyLoginToken(token);

      // Assert
      expect(result).toEqual(mockAuthResponse);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange
      const token = 'invalid-token';
      jwtService.verifyAsync.mockRejectedValue(new Error());

      // Act & Assert
      await expect(service.verifyLoginToken(token)).rejects.toThrow(UnauthorizedException);
    });
  });
});
