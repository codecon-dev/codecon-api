import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Attendee } from './entities/attendee.entity';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Attendee),
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
    it('should return welcome message with attendee data when attendees exist', async () => {
      jest.spyOn(appService, 'getAttendees').mockResolvedValue([
        { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Tech Corp', points: 100, createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', company: 'Dev Inc', points: 150, createdAt: new Date(), updatedAt: new Date() },
      ]);
      const result = await appController.getHello();
      expect(result).toBe('Welcome to CodeCon API! We have 2 attendees. First attendee: John Doe');
    });

    it('should return welcome message without attendee data when no attendees exist', async () => {
      jest.spyOn(appService, 'getAttendees').mockResolvedValue([]);
      const result = await appController.getHello();
      expect(result).toBe('Welcome to CodeCon API! No attendees registered yet.');
    });
  });
});
