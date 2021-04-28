import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AWS from 'aws-sdk';
import { AWS_REGION } from '../../config/loadConfig';

@Injectable()
export class S3Service {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  /**
   * 특정 유저의 대문 이미지를 S3에 업로드합니다.
   * @param folderAndFileName 폴더명을 포함한 파일명
   * @param imageSrc 이미지 base64 dataURI
   * @returns 업로드된 이미지의 S3 접근 URL을 반환합니다.
   */
  public async uploadBase64ImageToS3(folderAndFileName: string, imageSrc: string): Promise<string | null> {
    if (!imageSrc.includes('data:image/')) return null;
    const s3 = new AWS.S3();
    const extension = imageSrc.substring('data:image/'.length, imageSrc.indexOf(';base64'));
    const fileType = imageSrc.substring('data:'.length, imageSrc.indexOf(';base64'));

    const fileName = `${folderAndFileName}.${extension}`;
    const imageBuffer = Buffer.from(imageSrc.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    try {
      await s3.putObject({
        Bucket: this.configService.get('BUCKET_NAME'),
        Key: fileName,
        Body: imageBuffer,
        ContentType: fileType,
      }).promise();
    } catch (e) {
      console.error(`uploadImageToS3(${fileName}) - `, e);
      throw new InternalServerErrorException('Image Upload Falied');
    }

    return [
      'https://',
      this.configService.get('BUCKET_NAME'),
      '.s3.',
      AWS_REGION,
      '.amazonaws.com/',
    ].join('') + fileName;
  }
}
