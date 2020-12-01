import { RolesBuilder } from 'nest-access-control';

// eslint-disable-next-line no-shadow
export enum AppRoles {
  USER = 'user',
  GUEST = 'guest'
}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(AppRoles.GUEST)
  .createAny('profile');

roles.grant(AppRoles.USER)
  .readOwn('profile', ['*']);
