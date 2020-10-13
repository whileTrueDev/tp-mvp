export interface UserToken {
  userId: string;

  refreshToken: string;

  createdAt?: Date;

  updatedAt?: Date;
}
