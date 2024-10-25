import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return welcome message with user data when users exist', async () => {
      jest.spyOn(appService, 'getUsers').mockResolvedValue([
        { id: '1', name: 'John Doe', email: 'john@example.com', password: 'hashed_password' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', password: 'hashed_password' },
      ]);
      const result = await appController.getHello();
      expect(result).toBe('Welcome to CodeCon API! We have 2 users. Users: John Doe, Jane Smith');
    });

    it('should return welcome message without user data when no users exist', async () => {
      jest.spyOn(appService, 'getUsers').mockResolvedValue([]);
      const result = await appController.getHello();
      expect(result).toBe('Welcome to CodeCon API! No users registered yet.');
    });
  });
});
