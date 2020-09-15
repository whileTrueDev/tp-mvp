import { Test, TestingModule } from '@nestjs/testing';
import { StreamAnalysisService } from './stream-analysis.service';

describe('StreamAnalysisService', () => {
  let service: StreamAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StreamAnalysisService],
    }).compile();

    service = module.get<StreamAnalysisService>(StreamAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
