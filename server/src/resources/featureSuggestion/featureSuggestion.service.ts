import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeatureSuggestionStateUpdateDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionStateUpdate.dto';
import { FeatureSuggestionPatchDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPatch.dto';
import { FeatureSuggestionPostDto } from '@truepoint/shared/dist/dto/featureSuggestion/featureSuggestionPost.dto';
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';

@Injectable()
export class FeatureSuggestionService {
  constructor(
    @InjectRepository(FeatureSuggestionEntity)
    private readonly FeatureSuggestionRepository: Repository<FeatureSuggestionEntity>,
  ) {}

  /**
   * 기능 제안 리스트 조회 메소드
   */
  public async findAll(): Promise<FeatureSuggestionEntity[]> {
    return this.FeatureSuggestionRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['replies'],
    });
  }

  /**
   * 개별 기능제안 글의 진행상태(개발중, 완료, 등등)를 수정하는 메소드
   * @param featureSuggestionData 상태 변경할 기능제안 데이터
   */
  public async stateUpdate(featureSuggestionData: FeatureSuggestionStateUpdateDto): Promise<number> {
    const { state, id } = featureSuggestionData;
    const result = await this.FeatureSuggestionRepository
      .update({ suggestionId: id }, { state });
    return result.affected;
  }

  /**
   * 기능제안 개별 글 UPDATE 메서드
   * @param fsDto 기능제안 개별 글 Insert 요청 DTO
   */
  async insert(fsDto: FeatureSuggestionPostDto): Promise<FeatureSuggestionEntity> {
    return this.FeatureSuggestionRepository.save(fsDto);
  }

  /**
   * 기능제안 개별 글 update 메서드
   * @param fsPatchDto 기능제안 개별 글 Patch 요청 DTO
   */
  async update(fsPatchDto: FeatureSuggestionPatchDto): Promise<number> {
    const {
      suggestionId, author, userId, category, title, content, isLock,
    } = fsPatchDto;
    const result = await this.FeatureSuggestionRepository
      .update({ suggestionId }, {
        author, userId, category, title, content, isLock,
      });
    return result.affected;
  }

  /**
   * 개별 기능제안 글 삭제 메소드
   * @param postId 삭제할 기능제안 글 고유 번호
   */
  async deleteOne(postId: number): Promise<number> {
    const result = await this.FeatureSuggestionRepository
      .delete(postId);
    return result.affected;
  }

  // async getData(): Promise<any> {
  //   const params = {
  //     Bucket: process.env.BUCKET_NAME,
  //     Key: 'feature-image/myimage.png',
  //   };
  //   const returnList = await s3.getObject(params).promise()
  //     .then((value) => {
  //       const b64 = Buffer.from(value.Body).toString('base64');
  //       // CHANGE THIS IF THE IMAGE YOU ARE WORKING WITH IS .jpg OR WHATEVER0
  //       const mimeType = 'image/*'; // e.g., image/png
  //       return (`<img src="data:${mimeType};base64,${b64}" />`);
  //     });
  //   return returnList;
  // }

  // async uploadImage(file: string): Promise<void> {
  //   // const encodedFile = await encodeBase64ImageFile(file);
  //   const param = {
  //     Bucket: process.env.BUCKET_NAME,
  //     Key: 'feature-image/myimage.png',
  //     ACL: 'public-read',
  //     ContentEncoding: 'base64',
  //     Body: fs.createReadStream(file),
  //     ContentType: 'image/*',
  //   };
  //   s3.putObject(param, (err) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       // console.log('upload');
  //     }
  //   });
  // }
}
