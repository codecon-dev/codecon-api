import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            loginSocial: jest.fn(),
            requestLoginLink: jest.fn(),
            verifyLoginToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      };
      const expectedResult = { 
        id: 'uuid', 
        ...createUserDto,
        provider: null,
        providerId: null
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult);

      const result = await controller.register(createUserDto);
      expect(result).toBe(expectedResult);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  // Add more test cases for other controller methods
});
