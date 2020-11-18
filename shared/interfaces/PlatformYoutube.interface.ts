export interface PlatformYoutube {
  // **************************************
  // 구글 아이디 연동 정보
  googleId: string;

  googleName: string;

  googleEmail: string;

  googleLogo: string;

  // *****************************************
  // youtube 정보
  youtubeId: string;

  youtubeTitle: string;

  youtubeLogo: string;

  youtubePublishedAt: Date;

  refreshToken: string;

  createdAt?: Date;

  updatedAt?: Date;
}
