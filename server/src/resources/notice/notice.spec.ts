import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

describe('Notice Unit Test', () => {
  let controller: NoticeController;
  let service: NoticeService;

  // class NoticeRepository extends Repository<NoticeEntity> {}

  const noticeList: NoticeEntity[] = [
    {
      id: 1,
      category: 'category',
      author: 'author',
      title: 'title',
      content: 'content',
      isImportant: true,
      createdAt: new Date(),
    },
    {
      id: 2,
      category: 'category2',
      author: 'author2',
      title: 'title2',
      content: 'content2',
      isImportant: true,
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticeController],
      providers: [
        NoticeService,
        {
          provide: getRepositoryToken(NoticeEntity),
          useClass: jest.fn(() => ({
            metadata: {
              columns: [],
              relations: [],
            },
          })),
        },
      ],
    }).compile();

    controller = module.get<NoticeController>(NoticeController);
    service = module.get<NoticeService>(NoticeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('공지사항 목록 불러오기', async () => {
    jest.spyOn(service, 'findAll').mockImplementation(async () => noticeList);
    expect(await controller.findAll(5)).toBe(noticeList);
  });

  it('공지사항 간단 목록 불러오기', async () => {
    jest.spyOn(service, 'findOutline').mockImplementation(async () => noticeList);
    expect(await controller.findForDashboard(2)).toBe(noticeList);
  });

  it('공지사항 개별 불러오기', async () => {
    jest.spyOn(service, 'findOne').mockImplementation(async (id) => noticeList.find((x) => x.id === id));
    expect(await controller.findOne(2)).toBe(noticeList.find((noti) => noti.id === 2));
  });
});
