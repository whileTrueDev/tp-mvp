import { ResourceWithOptions } from 'admin-bro';
import { CreatorCommentsEntity } from '../../resources/creatorComment/entities/creatorComment.entity';

const CreatorCommentsResource: ResourceWithOptions = {
  resource: CreatorCommentsEntity,
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

export default CreatorCommentsResource;
