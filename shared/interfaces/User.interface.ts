import { Subscribe } from './Subscribe.interface';

export interface User {
  userId: string;

  nickName: string;

  name: string;

  mail: string;

  phone: string;

  userDI?: string;

  password: string;

  birth: string;

  gender: string;

  roles?: string;

  twitchId?: string;

  afreecaId?: string;

  youtubeId?: string;

  marketingAgreement: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  subscribe?: Subscribe[];
}
