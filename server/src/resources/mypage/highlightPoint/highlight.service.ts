import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import * as archiver from 'archiver';
import { resolve } from 'path';

dotenv.config();
const s3 = new AWS.S3();

@Injectable()
export class HighlightService {
  async getHighlightData(id, year, month, day, fileId): Promise<any> {
    const editFile = fileId.split('.')[0];
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Key: `highlight_json/${id}/${year}/${month}/${day}/${fileId}`
    };
    const returnHighlight = await s3.getObject(getParams).promise();
    return returnHighlight.Body.toString('utf-8');
  }

  async getMetricsData(id, year, month, day, fileId): Promise<any> {
    const editFile = fileId.split('.')[0];
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
  async getStreamListForCalendarBtn(name: string, year: string, month: string, day: string): Promise<string[]> {
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
  async getZipFile(id, year, month, day, streamId, srt, csv, txt): Promise<any> {
    const boolCsv = Boolean(Number(csv));
    const boolSrt = Boolean(Number(srt));
    const boolTxt = Boolean(Number(txt));
    const getParams = {
      Bucket: process.env.BUCKET_NAME, // your bucket name,
      Prefix: `export_files/${id}/${year}/${month}/${day}/${streamId}`,
    };
    const getArray = [];
    const getFiles = await s3.listObjects(getParams).promise()
      .then((value) => {
        value.Contents.map((content) => {
          getArray.push(content.Key);
        });
      });
    if (!boolSrt) {
      getArray.map((value, index) => {
        value.indexOf('srt') !== -1 ? getArray.splice(index, 1) : null;
      });
    }
    if (!boolTxt) {
      getArray.map((value, index) => {
        value.indexOf('txt') !== -1 ? getArray.splice(index, 1) : null;
      });
    }
    if (!boolCsv) {
      getArray.map((value, index) => {
        value.indexOf('csv') !== -1 ? getArray.splice(index, 1) : null;
      });
    }

    const doGetSelectedFiles = await this.getSelectedFile(getArray);
    return doGetSelectedFiles;
  }
  async getSelectedFile(fileName): Promise<any> {
    const zip = archiver.create('zip');
    const doZip = await Promise.all(fileName.map(async (key) => {
      const getParams = {
        Bucket: process.env.BUCKET_NAME, // your bucket name,
        Key: `${key}`,
      };
      const getObj = await s3.getObject(getParams).promise()
        .then((value) => {
          const fileData = value.Body.toString('utf-8');
          const toSaveName = key.split('/')[6];
          zip.append(fileData, {
            name: toSaveName
          });
        }).catch((err) => {
          console.log(err);
        });
    })).then(() => {
      zip.finalize();
    });
    return zip;
  }
}
