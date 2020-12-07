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

    const getAllParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Prefix: 'highlight_json/afreeca/arinbbidol/',
      // highlight_json/ 뒤에 플랫폼/크리에이터 네임 필요함..
    };
    const getArray = [];
    const returnObject = { chat_points: '', highlight_points: '', smile_points: '' };
    await s3.listObjects(getAllParams).promise()
      .then((value) => {
        value.Contents.forEach((content) => {
          const directoryId = content.Key.split('/')[5];
          const unique_key = fileId.split('_')[0];
          if (directoryId.length !== 0 && directoryId.includes(unique_key)) {
            getArray.push(content.Key);
          }
        });
      });

    await Promise.all(getArray.map(async (key, i) => {
      const getParams = {
        Bucket: process.env.BUCKET_NAME, // your bucket name,
        Key: `${key}`,
      };
      await s3.getObject(getParams).promise()
        .then((value: any) => {
          if (i === 0) {
            returnObject.chat_points = JSON.parse(value.Body.toString('utf-8'));
          }
          if (i === 1) {
            returnObject.highlight_points = JSON.parse(value.Body.toString('utf-8'));
          }
          if (i === 2) {
            returnObject.smile_points = JSON.parse(value.Body.toString('utf-8'));
          }
        }).catch((err) => {
          console.error(err);
        });
    }));
    return returnObject;

    // const getParams = {
    //   Bucket: process.env.BUCKET_NAME, // your bucket name,
    //   Key: `highlight_json/${id}/${year}/${month}/${day}/${fileId}`,
    // };

    // const returnHighlight = await s3.getObject(getParams).promise();
  }

  async getMetricsData(id: string, year: string, month: string, day: string, fileId: string): Promise<any> {
    // const editFile = fileId.split('.')[0];
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      // Key: `metrics_json/${id}/${year}/${month}/${day}/${fileId}`,
      Key: 'metrics_json/234175534/2020/12/01/11100927_1110162750_20201201092750arinbbidol.json.json',

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
      Prefix: `highlight_json/234175534/2020/${month}`,
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
      Prefix: `highlight_json/${name}/${year}/${month}/${day}`,
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
