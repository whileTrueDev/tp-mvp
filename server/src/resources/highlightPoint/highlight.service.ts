import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import {
  ForbiddenException,
  HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import * as archiver from 'archiver';
import { PromiseResult } from 'aws-sdk/lib/request';
import { cutFile } from '../../utils/highlishtFileUtils';

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
  async getHighlightData(streamId: string, platform: string, creatorId: string): Promise<any> {
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: `highlight_json/${platform}/${creatorId}/${streamId}_highlight.json`,
    };
    const returnHighlight = await s3.getObject(getParams).promise();

    return returnHighlight.Body.toString('utf-8');
  }

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
    let getArray: string[] = await this.getFileKeys(getParams);

    if (!boolSrt) {
      getArray = getArray.filter((key) => !key.includes('srt'));
    }
    if (!boolCsv) {
      getArray = getArray.filter((key) => !key.includes('csv'));
    }
    // if (!boolTxt) {
    //   getArray = getArray.filter((key) => !key.includes('txt'));
    // }

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

  /**
   * 오디오파일 수집 대상자 creatorId. 수가 많지 않아서 내부변수로 둠
   *   //아프리카: BJ강덕구(sdkels), 감스트(devil0108)
        //트위치: 랄로(29654002) , 피닉스박(175163251) ,오킹(166079347)
   */
  private readonly audioCollectCreatorsId = ['175163251', '166079347', '29654002', 'sdkels', 'devil0108'];

  private isAudioCollectTarget(creatorId: string): boolean {
    return this.audioCollectCreatorsId.includes(creatorId);
  }

  async getSoundFileStream(props: {
    creatorId: string,
    platform: 'afreeca'|'youtube'|'twitch',
    streamId: string,
  }): Promise<any> {
    const {
      creatorId, platform, streamId,
    } = props;

    if (!this.isAudioCollectTarget(creatorId)) {
      // 오디오 수집 대상자가 아닌 경우
      throw new ForbiddenException('사운드파일 수집 대상자가 아닙니다. 사운드 파일 기능을 이용하고 싶으시면 고객센터로 문의해주세요!');
    }

    const getListParams = {
      Bucket: process.env.BUCKET_NAME,
      Prefix: `export_files/${platform}/${creatorId}/${streamId}/audio`, // 사운드파일 저장 위치
    };

    // audio폴더 아래 있는 파일의 키 저장
    const keyArray = await this.getFileKeys(getListParams);

    if (keyArray.length === 0) {
      // audio 폴더 내 파일이 없는 경우(오디오 파일이 없는 경우)
      throw new NotFoundException('사운드 파일이 존재하지 않습니다');
    }
    const key = keyArray[0];
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: `${key}`,
    };

    return s3.getObject(getParams).createReadStream();
  }
}
