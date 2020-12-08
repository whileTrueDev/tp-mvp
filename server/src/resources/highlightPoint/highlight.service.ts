import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';

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

  async getMetricsData(id: string, year: string, month: string, day: string, fileId: string): Promise<any> {
    // const editFile = fileId.split('.')[0];
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      // Key: `metrics_json/${id}/${year}/${month}/${day}/${fileId}`,
      Key: 'metrics_json/afreeca/arinbbidol/2020/12/2/11100927_11111651_20201201092750arinbbidol.json',
    };
    const returnHighlight = await s3.getObject(getParams).promise();
    return returnHighlight.Body.toString('utf-8');
  }

  async getDateListForCalendar(
    platform: 'afreeca'|'youtube'|'twitch', name: string, year: string, month: string,
  ): Promise<string[]> {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Delimiter: '',
      // Prefix: `highlight_json/${platform}/${name}/${year}/${month}`,
      Prefix: 'highlight_json/arinbbidol/2020/12',
    };
    const keyArray = [];
    await s3.listObjects(params).promise()
      .then((value) => {
        value.Contents.forEach((v) => {
          const getKey = v.Key.split('/')[4];
          // 공백제거

          if (v.Key.split('/')[4].length !== 0) {
            keyArray.push(Number(getKey));
          }
        });
      });
    const uniq = [...new Set(keyArray)];
    return uniq;
  }

  async getStreamListForCalendarBtn(
    platform: 'afreeca'|'youtube'|'twitch', name: string, year: string, month: string, day: string,
  ): Promise<string[]> {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Delimiter: '',
      // Prefix: `highlight_json/${platform}/${name}/${year}/${month}/${day}`,
      Prefix: 'highlight_json/arinbbidol/2020/12/2',
    };
    const keyArray = [];
    const returnArray = [];
    await s3.listObjects(params).promise()
      .then((value) => {
        value.Contents.forEach((v) => {
          const getKey = v.Key.split('/')[5];
          if (getKey.includes('highlight')) {
            keyArray.push(getKey);
          }
        });
      });
    const filterEmpty = keyArray.filter((item) => item !== null && item !== undefined && item !== '');
    filterEmpty.forEach((value) => {
      const startAt = value.split('_')[0];
      const finishAt = value.split('_')[1];
      const fileId = value;
      const oneStream = {
        getState: true, startAt, finishAt, fileId, platform,
      };
      returnArray.push(oneStream);
    });
    return returnArray;
  }

  async getZipFile(
    id: string, year: string, month: string, day: string, streamId: string,
    srt: number, csv: number, txt: number,
  ): Promise<any> {
    const boolCsv = Boolean(Number(csv));
    const boolSrt = Boolean(Number(srt));
    const boolTxt = Boolean(Number(txt));
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Prefix: `export_files/${id}/${year}/${month}/${day}/${streamId}`,
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
    if (!boolTxt) {
      getArray.forEach((value, index) => {
        if (value.indexOf('txt') !== -1) {
          getArray.splice(index, 1);
        }
      });
    }
    if (!boolCsv) {
      getArray.forEach((value, index) => {
        if (value.indexOf('csv') !== -1) {
          getArray.splice(index, 1);
        }
      });
    }

    const doGetSelectedFiles = await this.getSelectedFile(getArray);
    return doGetSelectedFiles;
  }

  async getSelectedFile(fileName: string[]): Promise<any> {
    const zip = archiver.create('zip');
    Promise.all(fileName.map(async (key) => {
      const getParams = {
        Bucket: process.env.BUCKET_NAME, // your bucket name,
        Key: `${key}`,
      };
      await s3.getObject(getParams).promise()
        .then((value) => {
          const fileData = value.Body.toString('utf-8');
          const toSaveName = key.split('/')[6];
          zip.append(fileData, {
            name: toSaveName,
          });
        }).catch((err) => {
          console.error(err);
        });
    })).then(() => {
      zip.finalize();
    });
    return zip;
  }
}
