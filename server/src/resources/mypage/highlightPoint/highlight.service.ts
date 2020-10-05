import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

dotenv.config();
const s3 = new AWS.S3();

@Injectable()
export class HighlightService {
  async getHighlightData(path): Promise<any> {
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: path
    };
    const returnHighlight = await s3.getObject(getParams).promise();
    return returnHighlight.Body.toString('utf-8');
  }

  async getMetricData(path): Promise<any> {
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: path
    };
    const returnHighlight = await s3.getObject(getParams).promise();
    return returnHighlight.Body.toString('utf-8');
  }

  async getDateList(name, year, month): Promise<string[]> {
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
          keyArray.push(Number(getKey));
        });
      });
    return keyArray;
  }

  async getStreamList(name, year, month, day): Promise<string[]> {
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
      const streamId = value.split('_')[2];
      const oneStream = { startAt, finishAt, streamId };
      returnArray.push(oneStream);
    });
    return returnArray;
  }
}
