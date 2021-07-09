import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import {
  HttpException, HttpStatus, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import * as archiver from 'archiver';

import {
  parseString, modify, stringify, getExtention,
} from '../../utils/highlishtFileUtils';

dotenv.config();
const s3 = new AWS.S3();

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

  // eslint-disable-next-line max-params
  async getZipFile(
    creatorId: string, platform: 'afreeca'|'youtube'|'twitch', streamId: string,
    exportCategory: string, srt: number, csv: number,
    startTime?: string,
    // , txt: number,
  ): Promise<any> {
    const boolCsv = Boolean(Number(csv));
    const boolSrt = Boolean(Number(srt));
    // const boolTxt = Boolean(Number(txt));
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Prefix: `export_files/${platform}/${creatorId}/${streamId}/${exportCategory}`,
    };
    const getArray = [];
    await s3.listObjects(getParams).promise()
      .then((value) => {
        value.Contents.forEach((content) => {
          getArray.push(content.Key);
        });
      });
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

    const doGetSelectedFiles = await this.getSelectedFile(getArray, startTime);
    return doGetSelectedFiles;
  }

  async getSelectedFile(fileName: string[], startTime?: string): Promise<any> {
    const zip = archiver.create('zip');
    Promise.all(fileName.map(async (key) => {
      const getParams = {
        Bucket: process.env.BUCKET_NAME, // your bucket name,
        Key: `${key}`,
      };

      await s3.getObject(getParams).promise()
        .then((value) => {
          const fileData = value.Body.toString('utf-8');

          if (startTime) {
            // 시작시간 있는 경우 - 부분 영상 편집점 내보내기
            const ext = getExtention(key);
            // 파일데이터 보정
            const parsed = parseString(fileData, ext);
            const modified = modify(parsed, startTime);
            const resultStr = stringify(modified, ext);
            const partialFileSaveName = `부분시작시간+${startTime.split(',')[0]}__${key.split('/')[5]}`;
            zip.append(resultStr, {
              name: partialFileSaveName,
            });
          } else {
            // 시작시간 없는 경우 - 파일 그대로 내보내기
            const toSaveName = key.split('/')[5];
            zip.append(fileData, {
              name: toSaveName,
            });
          }
        }).catch((err) => {
          console.error(err);
        });
    })).then(() => {
      // 파일 생성
      zip.finalize();
    }).catch((error) => {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in getSelectedFile');
    });
    return zip;
  }
}
