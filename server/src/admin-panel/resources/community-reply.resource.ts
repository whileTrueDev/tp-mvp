import AdminBro, { ResourceWithOptions } from 'admin-bro';
import { CREATE_DATE__DESC, showOnly } from '../config';
import { CommunityReplyEntity } from '../../resources/communityBoard/entities/community-reply.entity';

const CREATE_CHILD_COMMENT_FOR_PARENT = AdminBro.bundle('../components/child-comment-for-post-comment');

const CommunityReplyResource: ResourceWithOptions = {
  resource: CommunityReplyEntity,
  options: {
    sort: CREATE_DATE__DESC,
    listProperties: [
      'replyId',
      'nickname',
      'content',
      'createDate',
      'ip',
      'postId',
      'userId',
      'deleteFlag',
      'reportCount',
      'parentReplyId',
    ],
    actions: {
      new: { isVisible: false },
    },
    properties: {
      content: { position: 1 },
      parentReplyId: { position: 2 },
      createChildComment: {
        components: { show: CREATE_CHILD_COMMENT_FOR_PARENT },
        isVisible: showOnly,
        position: 3,
      },
    },
    navigation: {
      name: '댓글',
      icon: '',
    },
  },
};

export default CommunityReplyResource;
