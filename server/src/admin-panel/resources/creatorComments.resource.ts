import AdminBro, { ResourceWithOptions } from 'admin-bro';
import { CREATE_DATE__DESC, showOnly } from '../config';
import { CreatorCommentsEntity } from '../../resources/creatorComment/entities/creatorComment.entity';

const LINK = AdminBro.bundle('../components/creator-comment-link.tsx');

const CreatorCommentsResource: ResourceWithOptions = {
  resource: CreatorCommentsEntity,
  options: {
    sort: CREATE_DATE__DESC,
    listProperties: [
      'commentId',
      'nickname',
      'content',
      'createDate',
      'deleteFlag',
      'reportCount',
      'creatorId',
      'parentCommentId',
    ],
    properties: {
      commentId: { isId: true },
      content: { isTitle: true },
      link: {
        components: {
          show: LINK, // 댓글이 달린 방송인 프로필 페이지로 이동
        },
        isVisible: showOnly,
      },
    },
    navigation: {
      name: '댓글',
      icon: '',
    },
  },
};

export default CreatorCommentsResource;
