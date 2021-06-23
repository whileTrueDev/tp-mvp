import { ResourceWithOptions } from 'admin-bro';
import { UserEntity } from '../../resources/users/entities/user.entity';

const UserResource: ResourceWithOptions = {
  resource: UserEntity,
  options: {
    properties: {
    },
    navigation: {
      name: '사용x . 계정설정 안해서 오류남 ',
      icon: '',
    },
  },
};

export default UserResource;
