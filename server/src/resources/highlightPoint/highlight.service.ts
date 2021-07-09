import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import {
  HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import * as archiver from 'archiver';
// import { Readable } from 'stream';
import { PromiseResult } from 'aws-sdk/lib/request';
import { cutFile } from '../../utils/highlishtFileUtils';
import { AWS_REGION } from '../../config/loadConfig';

dotenv.config();
const s3 = new AWS.S3();

type GetObjectCallbackOptions = {startTime?: string}
type GetObjectCallbackProps = {
  value: PromiseResult<AWS.S3.GetObjectOutput, AWS.AWSError>,
  options?: GetObjectCallbackOptions,
  zip: archiver.Archiver,
  key: string
};
type GetObjectCallback = (props: GetObjectCallbackProps) => Promise<void>

@Injectable()
export class HighlightService {
  // 해당 폴더 내 파일의 key를 배열에 저장하여 리턴
  private async getFileKeys(params: AWS.S3.ListObjectsRequest): Promise<string[]> {
    const getArray = [];
    await s3.listObjects(params).promise()
      .then((value) => {
        value.Contents.forEach((content) => {
          getArray.push(content.Key);
        });
      }).catch((error) => console.error(error, 'error in get File keys'));
    return getArray;
  }

  // zip 객체에 편집점 파일을 추가
  private async appendHighlightFiles({
    value, options, zip, key,
  }: GetObjectCallbackProps): Promise<void> {
    const fileData = value.Body.toString('utf-8');

    if (options && options.startTime) {
      // 시작시간 있는 경우 - 부분 영상 편집점 내보내기
      const { startTime } = options;

      const resultStr = cutFile({ key, fileData, startTime });
      const cutFileSaveName = `부분시작시간+${startTime.split(',')[0]}__${key.split('/')[5]}`;
      zip.append(resultStr, {
        name: cutFileSaveName,
      });
    } else {
      // 시작시간 없는 경우 - 파일 그대로 내보내기
      const toSaveName = key.split('/')[5];
      zip.append(fileData, {
        name: toSaveName,
      });
    }
  }

  async getHighlightData(streamId: string, platform: string, creatorId: string): Promise<any> {
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: `highlight_json/${platform}/${creatorId}/${streamId}_highlight.json`,
    };
    const returnHighlight = await s3.getObject(getParams).promise();

    return returnHighlight.Body.toString('utf-8');
  }

  // eslint-disable-next-line max-params
  async getHighlightZipFile(
    creatorId: string, platform: 'afreeca'|'youtube'|'twitch', streamId: string,
    exportCategory: string, srt: number, csv: number,
    startTime?: string,
    // , txt: number,
  ): Promise<archiver.Archiver> {
    const boolCsv = Boolean(Number(csv));
    const boolSrt = Boolean(Number(srt));
    // const boolTxt = Boolean(Number(txt));
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Prefix: `export_files/${platform}/${creatorId}/${streamId}/${exportCategory}`,
    };
    const getArray = await this.getFileKeys(getParams);

    if (!boolSrt) {
      getArray.forEach((value, index) => {
        if (value.indexOf('srt') !== -1) {
          getArray.splice(index, 1);
        }
      });
    }
    // if (!boolTxt) {
    //   getArray.forEach((value, index) => {
    //     if (value.indexOf('txt') !== -1) {
    //       getArray.splice(index, 1);
    //     }
    //   });
    // }
    if (!boolCsv) {
      getArray.forEach((value, index) => {
        if (value.indexOf('csv') !== -1) {
          getArray.splice(index, 1);
        }
      });
    }

    // getArry가 빈 배열일 경우 - 분석된 데이터가 없는것으로 보고
    // 에러 발생시킴
    if (!getArray.length) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: '데이터가 없습니다',
      }, HttpStatus.NOT_FOUND);
    }

    return this.getSelectedFileToZip(getArray, this.appendHighlightFiles, { startTime });
  }

  /**
   * fileName(key) 배열을 받아서 
   * 해당 key 가진 파일에 callback함수 적용하여 
   * 압축후 압축파일 리턴
   * @param fileName key의 배열
   * @param callback 해당 key를 가진 object에 적용할 콜백함수. value, callbackOption, zip(archiver), key 를 인자로 받는다
   * @param options 콜백함수에 전달할 옵션
   * @returns 
   */
  async getSelectedFileToZip(
    fileName: string[],
    callback: GetObjectCallback,
    options?: GetObjectCallbackOptions,
  ): Promise<archiver.Archiver> {
    const zip = archiver.create('zip');
    Promise.all(fileName.map(async (key) => {
      const getParams = {
        Bucket: process.env.BUCKET_NAME, // your bucket name,
        Key: `${key}`,
      };

      await s3.getObject(getParams).promise()
        .then((value) => {
          callback({
            value,
            options,
            zip,
            key,
          });
        }).catch((err) => {
          console.error(err);
        });
    })).then(() => {
      zip.finalize();
    }).catch((error) => {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in getSelectedFile');
    });
    return zip;
  }

  // zip 객체에 사운드 파일 추가
  private async appendSoundFile({
    value, zip, key,
  }: GetObjectCallbackProps): Promise<void> {
    const body = Buffer.from(value.Body);
    const toSaveName = key.split('/')[5];
    zip.append(body, {
      name: toSaveName,
    });
  }

  async getSoundZipFile(props: {
    creatorId: string,
    platform: 'afreeca'|'youtube'|'twitch',
    streamId: string,
  }): Promise<archiver.Archiver> {
    const {
      creatorId, platform, streamId,
    } = props;

    const getParams = {
      Bucket: process.env.BUCKET_NAME,
      Prefix: `export_files/${platform}/${creatorId}/${streamId}/audio`, // 사운드파일 저장 위치
    };

    // audio폴더 아래 있는 파일의 키 저장
    const keyArray = await this.getFileKeys(getParams);

    if (keyArray.length === 0) {
      // audio 폴더 내 파일이 없는 경우(오디오 파일이 없는 경우)
      throw new NotFoundException('사운드 파일이 존재하지 않습니다');
    }

    // audio 폴더 내 파일이 있는 경우
    // 파일 키를 이용하여 파일을 가져온다
    return this.getSelectedFileToZip(keyArray, this.appendSoundFile);
  }

  async getSoundFileStream(props: {
    creatorId: string,
    platform: 'afreeca'|'youtube'|'twitch',
    streamId: string,
  }): Promise<any> {
    const {
      creatorId, platform, streamId,
    } = props;

    const getParams = {
      Bucket: process.env.BUCKET_NAME,
      Prefix: `export_files/${platform}/${creatorId}/${streamId}/audio`, // 사운드파일 저장 위치
    };

    // audio폴더 아래 있는 파일의 키 저장
    const keyArray = await this.getFileKeys(getParams);

    if (keyArray.length === 0) {
      // audio 폴더 내 파일이 없는 경우(오디오 파일이 없는 경우)
      throw new NotFoundException('사운드 파일이 존재하지 않습니다');
    }
    const key = keyArray[0];
    // return key;

    const encodedKey = encodeURIComponent(key).replace('%20', '+');

    const url = [
      'https://',
      process.env.BUCKET_NAME,
      '.s3.',
      AWS_REGION,
      '.amazonaws.com/',
    ].join('') + encodedKey;

    return url;
  }
}
