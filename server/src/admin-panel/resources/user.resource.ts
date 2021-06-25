import { ResourceWithOptions } from 'admin-bro';
import { UserEntity } from '../../resources/users/entities/user.entity';

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: {
    properties: {
    },
    navigation: {
      name: '사용x',
      icon: '',
    },
  },
};

export default UserResource;
