import { ResourceWithOptions } from 'admin-bro';
import { UserEntity } from '../../resources/users/entities/user.entity';

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: {
    properties: {
    },
    navigation: {
      name: '유저 네비게이션',
      icon: '',
    },
  },
};

export default UserResource;
