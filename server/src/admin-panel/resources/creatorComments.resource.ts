import { ResourceWithOptions } from 'admin-bro';
import { CREATE_DATE__DESC } from '../config';
import { CreatorCommentsEntity } from '../../resources/creatorComment/entities/creatorComment.entity';

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
    },
    navigation: {
      name: '댓글',
      icon: '',
    },
  },
};

export default CreatorCommentsResource;
