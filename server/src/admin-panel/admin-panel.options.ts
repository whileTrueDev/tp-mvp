import { AdminModuleOptions } from '@admin-bro/nestjs';
import * as dotenv from 'dotenv';
import {
  UserResource,
  CommunityPostResource,
  CommunityReplyResource,
  StreamCommentsResource, // TODO: streamEntity 와 relation 조회가 안되는듯함 (streamEntity primarykey 가 복합키인데 복합키로 조회하는방법 안찾아봄)
  StreamsResource,
  CreatorCommentsResource,
} from './resources';

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
      StreamsResource,
      CommunityPostResource,
      CommunityReplyResource,
      StreamCommentsResource,
      CreatorCommentsResource,
    ],
    locale: {
      language: 'ko',
      translations: {
        labels: { // resource 이름 - src/resources/**/enties/**.entity.ts 에서 export 되는 class이름을 사용한다
          UserEntity: '유저',
          CommunityPostEntity: '자유게시판 글',
          CommunityReplyEntity: '자유게시판 댓글',
          StreamsEntity: '방송정보',
          StreamCommentsEntity: '방송 상세페이지 댓글(아직 오류해결못함)',
          CreatorCommentsEntity: '방송인 프로필 페이지 댓글',
        },
        properties: { // 모든 resource 의 property에 적용되는 이름
          title: '제목',
          createDate: '생성일',
          nickname: '닉네임',
          content: '내용',
          deleteFlag: '삭제여부',
          reportCount: '신고수',
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
          CommunityReplyEntity: {
            properties: {

            },
          },
          StreamCommentsEntity: {

          },
          CreatorCommentsEntity: {

          },
        },

      },
    },
  },
});
