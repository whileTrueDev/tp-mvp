import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

dotenv.config();
const s3 = new AWS.S3();

@Injectable()
export class HighlightService {
  async getHighlightData(id, year, month, day, fileId): Promise<any> {
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: `highlight_json/${id}/${year}/${month}/${day}/${fileId}`
    };
    const returnHighlight = await s3.getObject(getParams).promise();
    return returnHighlight.Body.toString('utf-8');
  }

  async getMetricsData(id, year, month, day, fileId): Promise<any> {
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: `metrics_json/${id}/${year}/${month}/${day}/${fileId}`
    };
    const returnHighlight = await s3.getObject(getParams).promise();
    return returnHighlight.Body.toString('utf-8');
  }

  async getDateListForCalendar(name, year, month): Promise<string[]> {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Delimiter: '',
      Prefix: `highlight_json/${name}/${year}/${month}`
    };
    const keyArray = [];
    const returnList = await s3.listObjects(params).promise()
      .then((value) => {
        value.Contents.map((v) => {
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
  async getStreamListForCalendarBtn(name, year, month, day): Promise<string[]> {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Delimiter: '',
      Prefix: `highlight_json/${name}/${year}/${month}/${day}`
    };
    const keyArray = [];
    const returnArray = [];
    const returnList = await s3.listObjects(params).promise()
      .then((value) => {
        value.Contents.map((v) => {
          const getKey = v.Key.split('/')[5];
          keyArray.push(getKey);
        });
      });
    const filterEmpty = keyArray.filter((item) => item !== null && item !== undefined && item !== '');
    filterEmpty.map((value) => {
      const startAt = value.split('_')[0];
      const finishAt = value.split('_')[1];
      const fileId = value;
      const oneStream = {
        getState: true, startAt, finishAt, fileId
      };
      returnArray.push(oneStream);
    });
    return returnArray;
  }
}
