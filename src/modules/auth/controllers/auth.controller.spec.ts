import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { User } from '../../users/entities/user.entity';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    loginSocial: jest.fn(),
    requestLoginLink: jest.fn(),
    verifyLoginToken: jest.fn(),
    registerWithEmail: jest.fn(),
    completeRegistration: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      // Arrange
      const inputCreateUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      const expectedUser: Partial<User> = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      };
      mockAuthService.register.mockResolvedValue(expectedUser as User);

      // Act
      const actualResult = await controller.register(inputCreateUserDto);

      // Assert
      expect(actualResult).toEqual(expectedUser);
      expect(authService.register).toHaveBeenCalledWith(inputCreateUserDto);
    });
  });

  describe('login', () => {
    it('should login a user and return access token', async () => {
      // Arrange
      const inputRequest = {
        user: { id: '1', email: 'test@example.com' },
      };
      const expectedResponse: AuthResponse = {
        accessToken: 'jwt-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600
      };
      mockAuthService.login.mockResolvedValue(expectedResponse);

      // Act
      const actualResult = await controller.login(inputRequest);

      // Assert
      expect(actualResult).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(inputRequest.user);
    });
  });

  describe('OAuth callbacks', () => {
    it('should handle Google OAuth callback', async () => {
      // Arrange
      const inputRequest = {
        user: { id: '1', email: 'test@example.com' },
      };
      const expectedResponse: AuthResponse = {
        accessToken: 'jwt-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600
      };
      mockAuthService.loginSocial.mockResolvedValue(expectedResponse);

      // Act
      const actualResult = await controller.googleCallback(inputRequest);

      // Assert
      expect(actualResult).toEqual(expectedResponse);
      expect(authService.loginSocial).toHaveBeenCalledWith(inputRequest.user);
    });

    it('should handle GitHub OAuth callback', async () => {
      // Arrange
      const inputRequest = {
        user: { id: '1', email: 'test@example.com' },
      };
      const expectedResponse: AuthResponse = {
        accessToken: 'jwt-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600
      };
      mockAuthService.loginSocial.mockResolvedValue(expectedResponse);

      // Act
      const actualResult = await controller.githubCallback(inputRequest);

      // Assert
      expect(actualResult).toEqual(expectedResponse);
      expect(authService.loginSocial).toHaveBeenCalledWith(inputRequest.user);
    });
  });

  describe('email authentication', () => {
    it('should request login link', async () => {
      // Arrange
      const inputEmail = { email: 'test@example.com' };
      const expectedResponse = {
        message: 'If an account exists, a login link has been sent to your email',
      };

      // Act
      const actualResult = await controller.requestLoginLink(inputEmail);

      // Assert
      expect(actualResult).toEqual(expectedResponse);
      expect(authService.requestLoginLink).toHaveBeenCalledWith(inputEmail.email);
    });

    it('should verify login token', async () => {
      // Arrange
      const inputToken = 'valid-token';
      const expectedResponse: AuthResponse = {
        accessToken: 'jwt-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600
      };
      mockAuthService.verifyLoginToken.mockResolvedValue(expectedResponse);

      // Act
      const actualResult = await controller.verifyLoginToken(inputToken);

      // Assert
      expect(actualResult).toEqual(expectedResponse);
      expect(authService.verifyLoginToken).toHaveBeenCalledWith(inputToken);
    });
  });

  describe('email registration', () => {
    it('should initiate email registration', async () => {
      // Arrange
      const inputEmail = { email: 'test@example.com' };
      const expectedResponse = {
        message: 'If the email is not registered, a registration link has been sent',
      };

      // Act
      const actualResult = await controller.registerWithEmail(inputEmail);

      // Assert
      expect(actualResult).toEqual(expectedResponse);
      expect(authService.registerWithEmail).toHaveBeenCalledWith(inputEmail.email);
    });

    it('should complete registration with token', async () => {
      // Arrange
      const inputBody = {
        token: 'valid-token',
        name: 'Test User',
      };
      const expectedResponse: AuthResponse = {
        accessToken: 'jwt-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600
      };
      mockAuthService.completeRegistration.mockResolvedValue(expectedResponse);

      // Act
      const actualResult = await controller.completeRegistration(inputBody);

      // Assert
      expect(actualResult).toEqual(expectedResponse);
      expect(authService.completeRegistration).toHaveBeenCalledWith(
        inputBody.token,
        inputBody.name
      );
    });
  });
});
