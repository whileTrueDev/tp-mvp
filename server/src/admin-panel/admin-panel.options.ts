import { AdminModuleOptions } from '@admin-bro/nestjs';
import * as dotenv from 'dotenv';
import axios from 'axios';
import getApiHost from '../utils/getApiHost';
import { Resources } from './resources';

dotenv.config();

export const getAdminOptions = (...args: any[]): AdminModuleOptions | Promise<AdminModuleOptions> => ({
  auth: { // admin 로그인 절차
    authenticate: async (email, password) => {
      try {
        const { data: adminValidated } = await axios({
          method: 'post',
          url: `${getApiHost()}/auth/adminLogin`,
          data: { userId: email, password },
        });
        if (!adminValidated) return null;
      } catch (error) {
        if (error.response) {
          console.error(error.response.message);
        }
        return null;
      }
      return Promise.resolve({ email });
    },
    cookieName: 'test',
    cookiePassword: 'testPass',
  },
  adminBroOptions: {
    rootPath: '/admin', // 어드민 화면
    branding: {
      companyName: '트루포인트 admin',
    },
    resources: Resources,
    locale: {
      language: 'ko',
      translations: {
        labels: { // resource 이름 - src/resources/**/enties/**.entity.ts 에서 export 되는 class이름을 사용한다
          UserEntity: '유저(관계 테이블 리소스 설정 안해서 조회안됨)',
          CommunityPostEntity: '자유게시판 글',
          CommunityReplyEntity: '자유게시판 댓글',
          StreamsEntity: '방송정보(해당 테이블 기본키 설정 못해서 조회 안됨)',
          StreamCommentsEntity: '방송 상세페이지 댓글',
          CreatorCommentsEntity: '방송인 프로필 페이지 댓글',
          FeatureSuggestionEntity: '기능제안 게시판 글',
          FeatureSuggestionReplyEntity: '기능제안 게시판 댓글',
          UserReactionEntity: '잡담방',
        },
        properties: { // 모든 resource 의 property에 적용되는 이름
          title: '제목',
          createdAt: '생성일',
          createDate: '생성일',
          nickname: '닉네임',
          content: '내용',
          deleteFlag: '삭제여부',
          reportCount: '신고수',
          author: '작성자(회원)',
          replyId: '댓글id',
          commentId: '댓글id',
          streamId: '방송id',
          parentCommentId: '연관댓글',
        },
        resources: { // 특정 resource의 property에만 적용되는 이름
          CommunityPostEntity: {
            properties: {
              recommend: '추천수',
              notRecommendCount: '비추',
              platform: '게시판',
              category: '분류',
              userId: 'userId - *** 관리자인 경우 "Truepoint" 입력 ***',
            },
          },
          FeatureSuggestionEntity: {
            properties: {
              suggestionId: '글번호',
              state: '진행상태',
              isLock: '비밀글 여부',
            },
          },
          FeatureSuggestionReplyEntity: {
            properties: {
              suggestionId: '연관글',
            },
          },
          UserReactionEntity: {
            properties: {
              username: '닉네임',
              userId: 'userId - *** 관리자인 경우 "Truepoint" 입력 ***',
            },
          },
          CommunityReplyEntity: {
            properties: {
              postId: '연관글',
            },
          },
        },

      },
    },
  },
});
