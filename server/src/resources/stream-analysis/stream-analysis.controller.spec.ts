import { Test, TestingModule } from '@nestjs/testing';
import { StreamAnalysisController } from './stream-analysis.controller';

describe('StreamAnalysis Controller', () => {
  let controller: StreamAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamAnalysisController],
    }).compile();

    controller = module.get<StreamAnalysisController>(StreamAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
