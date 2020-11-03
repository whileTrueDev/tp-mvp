import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';
import { FeatureSuggestion } from '../../../../shared/interfaces/FeatureSuggestion.interface';

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
export class FeatureSuggestionService {
  constructor(
    @InjectRepository(FeatureSuggestionEntity)
    private readonly FeatureRepository: Repository<FeatureSuggestionEntity>,
  ) { }

  // @hwasurr 2020.10.13 eslint error 정리중 disalbe
  // @leejineun 올바른 타입 정의 후 처리바람니다~~!!
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async insertFeatureSuggestion(state: any): Promise<void> {
    await this.FeatureRepository
      .createQueryBuilder()
      .insert()
      .into('FeatureSuggestion')
      .values([
        {
          category: state.category,
          author: state.userId,
          title: state.title,
          content: state.contents,
          reply: null,
          progress: 0,
        },
      ])
      .execute();
  }

  // @hwasurr 2020.10.13 eslint error 정리중 disalbe
  // @leejineun 올바른 타입 정의 후 처리바람니다~~!!
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async updateFeatureSuggestion(state: any): Promise<void> {
    const initialData = state[0];
    const postId = state[1];
    console.log(state);
    await this.FeatureRepository
      .createQueryBuilder()
      .update('FeatureSuggestion', {
        category: initialData.category,
        author: state.userId,
        title: initialData.title,
        content: initialData.contents,
        reply: null,
        progress: 0,
      })
      .where('FeatureSuggestion.id = :id', { id: postId })
      .andWhere('FeatureSuggestion.author = :id', { id: state.userId })
      .execute()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });
  }

  async deleteFeatureSuggestion(postId: number): Promise<void> {
    await this.FeatureRepository
      .createQueryBuilder()
      .delete()
      .from('FeatureSuggestion')
      .where('id = :id', { id: postId })
      .execute()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });
  }

  async getBoardData(): Promise<any> {
    return this.FeatureRepository.find();
  }

  async getEditData(authorId: string, postId: number): Promise<any> {
    const suggestionData = await this.FeatureRepository
      .createQueryBuilder('FeatureSuggestion')
      .select(['FeatureSuggestion.*'])
      .where('FeatureSuggestion.author = :id', { id: authorId })
      .andWhere('FeatureSuggestion.id = :id', { id: postId })
      .execute()
      .catch((err) => {
        throw new InternalServerErrorException(err, 'mySQL Query Error in Stream-Analysis ... ');
      });

    return suggestionData;
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

  async uploadImage(file: string): Promise<void> {
    // const encodedFile = await encodeBase64ImageFile(file);
    const param = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'feature-image/myimage.png',
      ACL: 'public-read',
      ContentEncoding: 'base64',
      Body: fs.createReadStream(file),
      ContentType: 'image/*',
    };
    s3.putObject(param, (err) => {
      if (err) {
        console.error(err);
      } else {
        // console.log('upload');
      }
    });
  }
}
