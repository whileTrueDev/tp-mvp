import { ResourceWithOptions } from 'admin-bro';
import { CREATE_DATE__DESC } from '../config';
import { CommunityReplyEntity } from '../../resources/communityBoard/entities/community-reply.entity';

const CommunityReplyResource: ResourceWithOptions = {
  resource: CommunityReplyEntity,
  options: {
    sort: CREATE_DATE__DESC,
    listProperties: [
    ],
    properties: {
    },
    navigation: {
      name: '댓글',
      icon: '',
    },
  },
};

export default CommunityReplyResource;
