import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sample } from './entities/sample.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Sample)
    private sampleRepository: Repository<Sample>,
  ) { }

  async getSamples(): Promise<Sample[]> {
    return this.sampleRepository.find();
  }
}
