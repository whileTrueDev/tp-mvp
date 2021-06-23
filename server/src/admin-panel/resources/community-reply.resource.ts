import { ResourceWithOptions } from 'admin-bro';
import { CommunityReplyEntity } from '../../resources/communityBoard/entities/community-reply.entity';

const CommunityReplyResource: ResourceWithOptions = {
  resource: CommunityReplyEntity,
  options: {
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
