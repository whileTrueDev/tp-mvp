import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
// import { ReadNoticeOutlineDto } from './dto/readNoticeOutline.dto';
import { FeatureEntity } from './entities/feature.entity';
import { DUMMY } from './feature.mock';

dotenv.config();
const s3 = new AWS.S3();
// function encodeBase64ImageFile(image): Promise<string | Buffer> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     // convert the file to base64 text
//     // on reader load somthing...
//     resolve(reader.readAsDataURL(image));
//   });
// }
@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(FeatureEntity)
    private readonly FeatureRepository: Repository<FeatureEntity>,
  ) { }

  async insertFeatureSuggestion(state) {
    await this.FeatureRepository
      .createQueryBuilder()
      .insert()
      .into('Feature')
      .values([
        {
          category: state.category, author: state.userId, title: state.title, content: state.contents, reply: null, progress: 0,
        }
      ])
      .execute();
  }
  async updateFeatureSuggestion(state) {
    const initialData = state[0];
    const postId = state[1];
    await this.FeatureRepository
      .createQueryBuilder()
      .update('Feature', {
        category: initialData.category, author: state.userId, title: initialData.title, content: initialData.contents, reply: null, progress: 0,
      })
      .where('Feature.id = :id', { id: postId })
      .execute();
  }
  async deleteFeatureSuggestion(postId) {
    await this.FeatureRepository
      .createQueryBuilder()
      .delete()
      .from('Feature')
      .where('id = :id', { id: postId })
      .execute();
  }
  async getBoardData(): Promise<any> {
    return this.FeatureRepository.find();
  }

  async getData(): Promise<any> {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'feature-image/myimage.png',
    };
    const returnList = await s3.getObject(params).promise()
      .then((value) => {
        const b64 = Buffer.from(value.Body).toString('base64');
        // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER0
        const mimeType = 'image/*'; // e.g., image/png
        return (`<img src="data:${mimeType};base64,${b64}" />`);
      });
    return returnList;
  }

  async uploadImage(file) {
    // const encodedFile = await encodeBase64ImageFile(file);
    const param = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'feature-image/myimage.png',
      ACL: 'public-read',
      ContentEncoding: 'base64',
      Body: fs.createReadStream(file),
      ContentType: 'image/*'
    };
    s3.putObject(param, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('upload');
      }
    });
  }
}
