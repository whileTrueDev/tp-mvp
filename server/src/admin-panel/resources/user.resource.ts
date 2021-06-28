import { ResourceWithOptions } from 'admin-bro';
import { UserEntity } from '../../resources/users/entities/user.entity';

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: {
    actions: {
      show: { isVisible: false },
      list: { isVisible: false },
    },
    properties: {
    },
    navigation: {
      name: '사용x',
      icon: '',
    },
  },
};

export default UserResource;
