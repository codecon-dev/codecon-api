import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../shared/services/email.service';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { UsersService } from '../../users/services/users.service';
import { AuthService } from '../services/auth.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let emailService: EmailService;

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
            sendLoginLink: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const hashedPassword = 'hashedPassword';

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (usersService.create as jest.Mock).mockResolvedValue({ ...createUserDto, id: 'userId', password: hashedPassword });

      await authService.register(createUserDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue({ id: 'existingUserId' });

      await expect(authService.register(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const user = {
        id: 'userId',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password123');

      expect(result).toEqual({ id: user.id, email: user.email, name: user.name });
    });

    it('should return null if credentials are invalid', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token for valid user', async () => {
      const user = { id: 'userId', email: 'test@example.com', name: 'Test User' };
      const token = 'jwt_token';

      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.login(user);

      expect(result).toEqual({ access_token: token });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id });
    });
  });

  describe('loginSocial', () => {
    it('should create a new user and return access token if user does not exist', async () => {
      const userData = {
        email: 'social@example.com',
        name: 'Social User',
        provider: 'google',
        providerId: 'googleId',
      };
      const token = 'jwt_token';

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue({ ...userData, id: 'newUserId' });
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.loginSocial(userData);

      expect(result).toEqual({ access_token: token });
      expect(usersService.create).toHaveBeenCalledWith(userData);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'newUserId' });
    });

    it('should return access token for existing user', async () => {
      const userData = {
        email: 'existing@example.com',
        name: 'Existing User',
        provider: 'github',
        providerId: 'githubId',
      };
      const existingUser = { ...userData, id: 'existingUserId' };
      const token = 'jwt_token';

      (usersService.findByEmail as jest.Mock).mockResolvedValue(existingUser);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await authService.loginSocial(userData);

      expect(result).toEqual({ access_token: token });
      expect(usersService.create).not.toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'existingUserId' });
    });
  });

  describe('requestLoginLink', () => {
    it('should send login link for existing user', async () => {
      const email = 'test@example.com';
      const user = { id: 'userId', email };

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);

      await authService.requestLoginLink(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(emailService.sendLoginLink).toHaveBeenCalledWith(
        email,
        expect.any(String)
      );
    });

    it('should not send login link for non-existing user', async () => {
      const email = 'nonexistent@example.com';

      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);

      await authService.requestLoginLink(email);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(emailService.sendLoginLink).not.toHaveBeenCalled();
    });
  });

  describe('verifyLoginToken', () => {
    it('should return access token for valid token', async () => {
      const email = 'test@example.com';
      const user = { id: 'userId', email };
      const token = 'valid_token';
      const jwtToken = 'jwt_token';
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 15);

      // Set up the token in the Map
      (authService as any).otpTokens.set(token, { email, expires });

      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (jwtService.sign as jest.Mock).mockReturnValue(jwtToken);

      const result = await authService.verifyLoginToken(token);

      expect(result).toEqual({ access_token: jwtToken });
      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id });
      // Verify token was deleted
      expect((authService as any).otpTokens.has(token)).toBeFalsy();
    });

    it('should throw UnauthorizedException for expired token', async () => {
      const token = 'expired_token';
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() - 1); // Set to past

      (authService as any).otpTokens.set(token, {
        email: 'test@example.com',
        expires,
      });

      await expect(authService.verifyLoginToken(token))
        .rejects
        .toThrow(UnauthorizedException);

      // Verify expired token was deleted
      expect((authService as any).otpTokens.has(token)).toBeFalsy();
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      const token = 'invalid_token';

      await expect(authService.verifyLoginToken(token))
        .rejects
        .toThrow(UnauthorizedException);
    });
  });
});
