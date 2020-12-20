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

  async getZipFile(
    creatorId: string, platform: 'afreeca'|'youtube'|'twitch', streamId: string,
    exportCategory: string, srt: number, csv: number,
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
          const toSaveName = key.split('/')[5];
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
