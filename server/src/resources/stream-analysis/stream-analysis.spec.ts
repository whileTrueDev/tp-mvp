// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// import { StreamsEntity } from './entities/streams.entity';
// import { StreamSummaryEntity } from './entities/streamSummary.entity';

// import { StreamAnalysisService } from './stream-analysis.service';
// import { StreamAnalysisController } from './stream-analysis.controller';

// describe('StreamAnalysis Controller', () => {
//   let controller: StreamAnalysisController;
//   let service: StreamAnalysisService;

//   class StreamsRepository extends Repository<StreamsEntity> {}
//   class StreamSummaryRepository extends Repository<StreamSummaryEntity> {}

//   // const streams: StreamsEntity[] = [

//   // ]

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [StreamAnalysisController],
//       providers: [
//         StreamAnalysisService,
//         {
//           provide: getRepositoryToken(StreamsEntity),
//           useClass: StreamsRepository,
//         },
//       ],
//     }).compile();

//     controller = module.get<StreamAnalysisController>(StreamAnalysisController);
//     service = module.get<StreamAnalysisService>(StreamAnalysisService);
//   });

//   it('캘린더 방송 정보 불러오기', async () => {
//     jest
//       .spyOn(service, 'getDaysStreamList')
//       .mockImplementation(async ({ userId, startDate, endDate }) => {

//       });
//   });
// });
