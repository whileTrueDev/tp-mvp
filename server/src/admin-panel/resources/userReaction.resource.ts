import { ResourceWithOptions } from 'admin-bro';
import { UserReactionEntity } from '../../resources/userReaction/entities/userReaction.entity';
import { CREATE_DATE__DESC } from '../config';

const UserReactionResource: ResourceWithOptions = {
  resource: UserReactionEntity,
  options: {
    sort: CREATE_DATE__DESC,
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
