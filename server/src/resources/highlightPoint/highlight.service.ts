import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';

dotenv.config();
const s3 = new AWS.S3();

@Injectable()
export class HighlightService {
  async getHighlightData(id: string, year: string, month: string, day: string, fileId: string): Promise<any> {
    // const editFile = fileId.split('.')[0];
    console.log(id, year, month, day, fileId, 'get High\n\n');
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      // Key: `highlight_json/${id}/${year}/${month}/${day}/${fileId}`,
      Key: 'highlight_json/arinbbidol/2020/12/2/2020-12-02 00:02:30_2020-12-02 06:59:30_20201201092750arinbbidol.json_highlight.json',

    };
    console.log(getParams, 'get highlight_json\n\n');
    const returnHighlight = await s3.getObject(getParams).promise();
    console.log(returnHighlight);
    return returnHighlight.Body.toString('utf-8');
  }

  async getMetricsData(id: string, year: string, month: string, day: string, fileId: string): Promise<any> {
    // const editFile = fileId.split('.')[0];
    console.log(id, year, month, day, fileId, 'get Met\n\n');
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      // Key: `metrics_json/${id}/${year}/${month}/${day}/${fileId}`,
      Key: 'metrics_json/afreeca/arinbbidol/2020/12/2/11100927_11111651_20201201092750arinbbidol.json',
    };
    console.log(getParams, 'get Met\n\n');
    const returnHighlight = await s3.getObject(getParams).promise();
    console.log(returnHighlight);
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
          const getKey = v.Key.split('/')[5];
          // 공백제거
          if (v.Key.split('/')[5].length !== 0) {
            keyArray.push(Number(getKey));
          }
        });
      });
    const uniq = [...new Set(keyArray)];
    // return uniq;
    return ['2'];
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
          console.log('KEY: \n', v.Key);
          const getKey = v.Key.split('/')[5];
          keyArray.push(getKey);
        });
      });
    const filterEmpty = keyArray.filter((item) => item !== null && item !== undefined && item !== '');
    filterEmpty.forEach((value) => {
      console.log('----------\n');
      console.log(value);
      console.log('----------\n');
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
