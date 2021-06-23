import { AdminModuleOptions } from '@admin-bro/nestjs';
import * as dotenv from 'dotenv';
import { UserResource, CommunityPostResource } from './resources';

dotenv.config();

export const getAdminOptions = (...args: any[]): AdminModuleOptions | Promise<AdminModuleOptions> => ({
  adminBroOptions: {
    rootPath: '/admin', // 어드민 화면
    // auth: {},
    branding: {
      companyName: '트루포인트',
    },
    resources: [ // 리소스
      UserResource,
      CommunityPostResource,
    ],
    locale: {
      language: 'ko',
      translations: {
        labels: { // resource 이름
          UserEntity: '유저 entity',
          CommunityPostEntity: '자유게시판 글',
        },
        properties: { // 모든 resource 의 property에 적용되는 이름
          title: '제목',
          createDate: '생성일',
          nickname: '닉네임',
          content: '내용',
        },
        resources: { // 특정 resource의 property에만 적용되는 이름
          CommunityPostEntity: {
            properties: {
              recommend: '추천수',
              notRecommendCount: '비추',
              platform: '게시판',
              category: '분류',
            },
          },
        },

      },
    },
  },
});
