import Axios, { AxiosRequestConfig } from 'axios';
import { getRepository, InsertResult, Repository } from 'typeorm';
import { BroadCategory, BroadCategoryResponse } from '../../interfaces/CategoryResponse.interface';
import { ConfigService } from '../../config/config.service';
import { BroadCategoryEntity } from './entities/category.entity';

export interface CaregoryResolveObject {
  totalCount: number;
}

export class CategoryService {
  private categoryUrl = 'https://openapi.afreecatv.com/broad/category/list';

  private categoryRepository: Repository<BroadCategoryEntity>;

  private categoryList: BroadCategory[];

  constructor(private configService: ConfigService) {
    this.categoryList = [];
    this.categoryRepository = getRepository(BroadCategoryEntity);
  }

  private makeRequestParams(): AxiosRequestConfig {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      },
      params: {
        client_id: this.configService.getValue('AFREECA_KEY'),
        locale: 'ko_KR',
        // ko_KR : 한국어
        // en_US : 영어
        // zh_CN : 중국어 간체
        // zh_TW : 중국어 번체
        // ja_JP : 일본어
        // th_TH : 태국어
        // vi_VN : 베트남어
      },
    };
  }

  private getBroadCategories(): Promise<BroadCategory[]> {
    const requestOptions = this.makeRequestParams();

    return new Promise<BroadCategory[]>((resolve, reject) => {
      Axios.get<BroadCategoryResponse>(this.categoryUrl, requestOptions)
        .then((res) => {
          if (Object.prototype.hasOwnProperty.call(res.data, 'broad_category')) {
            res.data.broad_category.forEach((cate) => {
              this.categoryList.push(cate);
            });
            resolve(this.categoryList);
          } else {
            reject(res.data.broad_category.length);
          }
        })
        .catch((err) => {
          console.error('error occuerred during borad category request\n', err);
        });
    });
  }

  public async getAll(): Promise<number> {
    return this.getBroadCategories()
      .then(async (result) => {
        let len = 0;
        result.forEach((c) => {
          len += 1;
          if (c.child) {
            c.child.forEach((s) => {
              len += 1;
            });
          }
        });
        console.info(`총 가져온 카테고리 데이터: ${len}`);
        return len;
      });
  }

  private nativeToEntity(categoryList: BroadCategory[]): BroadCategoryEntity[] {
    const entities: BroadCategoryEntity[] = [];
    categoryList.forEach((category) => {
      entities.push({
        categoryId: category.cate_no,
        categoryNameKr: category.cate_name,
        isSub: !category.child,
      });

      // 하위 카테고리가 있는 경우
      if (category.child) {
        category.child.forEach((subCate) => {
          entities.push({
            categoryId: subCate.cate_no,
            categoryNameKr: subCate.cate_name,
            isSub: true, // true
            parentCategoryId: category.cate_no,
          });
        });
      }
    });
    return entities;
  }

  public saveAll(): Promise<InsertResult> {
    const values = this.nativeToEntity(this.categoryList);
    return this.categoryRepository.createQueryBuilder()
      .insert()
      .into(BroadCategoryEntity)
      .orUpdate({
        conflict_target: ['categoryId'],
        overwrite: ['categoryId', 'categoryNameKr', 'isSub', 'parentCategoryId'],
      })
      .values(values)
      .execute();
  }

  public findAll(): Promise<BroadCategoryEntity[]> {
    return this.categoryRepository.find();
  }
}
