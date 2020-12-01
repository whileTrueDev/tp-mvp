import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SlackService } from './slack.service';

describe('SlackService', () => {
  let service: SlackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackService],
      imports: [ConfigModule],
    }).compile();

    service = module.get<SlackService>(SlackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
