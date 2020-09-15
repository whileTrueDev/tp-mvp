import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

dotenv.config();
const s3 = new AWS.S3();

@Injectable()
export class HighlightService {
  // getData(path) {
  //   const getParams = {
  //     Bucket: process.env.BUCKET_NAME, // your bucket name,
  //     Key: path
  //   };
  //   s3.getObject(getParams, (err, data) => {
  //     if (err) {
  //       console.log(err, err.stack);
  //     } else {
  //       const objectData = data.Body.toString('utf-8'); // Use the encoding necessary
  //       console.log(objectData);
  //     }
  //     console.log('JOB DONE');
  //   });
  // }
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

  async getList(name): Promise<string> {
    const params = {
      Bucket: 'truepoint',
      Delimiter: '',
      Prefix: `highlight_json/${name}`
    };
    const returnList = await s3.listObjects(params).promise();
    return returnList.Contents[0].Key;
  }
}
// highlight_json/134859149/2020-09-13/39667416302/39667416302
