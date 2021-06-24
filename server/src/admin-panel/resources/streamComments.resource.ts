import { ResourceWithOptions } from 'admin-bro';
import { StreamCommentsEntity } from '../../resources/broadcast-info/entities/streamComment.entity';
import { CREATE_DATE__DESC } from '../config';

const StreamCommentsResource: ResourceWithOptions = {
  resource: StreamCommentsEntity,
  options: {
    sort: CREATE_DATE__DESC,
    listProperties: [
      'commentId',
      'nickname',
      'content',
      'createDate',
      'deleteFlag',
      'reportCount',
      'streamId',
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

export default StreamCommentsResource;
