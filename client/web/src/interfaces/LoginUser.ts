export interface LoginUser {
  userId: string;
  userName: string;
  userDI: string;
  roles: string;
  nickName: string;
  profileImage?: string;
  provider?: string;
  mail?: string;
}
