import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Sample } from './entities/sample.entity';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getRepositoryToken(Sample),
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
    it('should return welcome message with sample data when samples exist', async () => {
      jest.spyOn(appService, 'getSamples').mockResolvedValue([
        { id: 1, name: 'Sample 1', description: 'This is the first sample' },
        { id: 2, name: 'Sample 2', description: 'This is the second sample' },
      ]);
      const result = await appController.getHello();
      expect(result).toBe('Welcome to CodeCon API! We have 2 samples. First sample: Sample 1');
    });

    it('should return welcome message without sample data when no samples exist', async () => {
      jest.spyOn(appService, 'getSamples').mockResolvedValue([]);
      const result = await appController.getHello();
      expect(result).toBe('Welcome to CodeCon API! No samples available yet.');
    });
  });
});
