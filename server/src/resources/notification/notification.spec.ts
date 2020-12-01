import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('Notification Controller', () => {
  let controller: NotificationController;
  let service: NotificationService;

  class NotificationRepository extends Repository<NotificationEntity> {}

  const notifications: NotificationEntity[] = [
    {
      index: 1,
      userId: 'userId',
      title: 'title',
      content: 'content',
      readState: 1,
      dateform: new Date(),
      createdAt: new Date(),
    },
    {
      index: 2,
      userId: 'userId1',
      title: 'title1',
      content: 'content',
      readState: 0,
      dateform: new Date(),
      createdAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(NotificationEntity),
          useClass: NotificationRepository,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('개인 알림 목록 불러오기', async () => {
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(async ({ userId }) => notifications.filter((x) => x.userId === userId));

    expect(await controller.findAllUserNotifications({ userId: 'userId' }))
      .toStrictEqual(notifications.filter((x) => x.userId === 'userId'));
  });

  it('개인 알림 읽음 상태 수정', async () => {
    jest
      .spyOn(service, 'changeReadState')
      .mockImplementation(async ({ userId, index }) => {
        const targetIndex = notifications.findIndex((x) => x.userId === userId && x.index === index);
        const target = notifications[targetIndex];
        if (target) {
          target.readState = target.readState === 0 ? 1 : 0;
          notifications[targetIndex] = target;
        }
        return true;
      });

    expect(await controller.updateNotificationReadState({ userId: 'userId', index: 1 }))
      .toBe(true);
  });
});
