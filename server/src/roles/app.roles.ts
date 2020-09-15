import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  USER = 'user',
  GUEST = 'guest'
}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(AppRoles.GUEST)
  .createAny('profile');

roles.grant(AppRoles.USER)
  .readOwn('profile', ['*']);
