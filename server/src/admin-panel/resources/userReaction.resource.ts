import { ResourceWithOptions } from 'admin-bro';
import { UserReactionEntity } from '../../resources/userReaction/entities/userReaction.entity';

const UserReactionResource: ResourceWithOptions = {
  resource: UserReactionEntity,
  options: {
    listProperties: [
    ],
    properties: {
    },
    navigation: {
      name: '글',
      icon: '',
    },
  },
};

export default UserReactionResource;
