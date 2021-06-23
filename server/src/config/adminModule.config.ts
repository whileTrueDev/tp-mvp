import { AdminModuleOptions } from '@admin-bro/nestjs';
import * as dotenv from 'dotenv';
import { UserEntity } from '../resources/users/entities/user.entity';

dotenv.config();

export const getAdminOptions = (...args: any[]): AdminModuleOptions | Promise<AdminModuleOptions> => ({
  adminBroOptions: {
    rootPath: '/admin',
    resources: [
      UserEntity,
    ],
  },
});
