export class CbtInquiry {
  id: number;

  name!: string;

  idForTest!: string;

  creatorName!: string;

  email!: string;

  platform!: string;

  phoneNum!: string;

  content!: string;

  privacyAgreement: boolean;

  createdAt?: Date;

  isComplete?: boolean;
}
