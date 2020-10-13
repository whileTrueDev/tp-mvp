export class Inquiry {
  id: number;

  author!: string;

  email!: string;

  content!: string;

  isReply?: boolean;

  privacyAgreement: boolean;

  createdAt?: Date;
}
