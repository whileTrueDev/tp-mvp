export interface RefreshTokenData {
  userId: string;
  refreshSelf: boolean;
  iat: number;
  exp: number;
}
