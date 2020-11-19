import Axios, { AxiosRequestConfig } from 'axios';
import { getRepository, InsertResult, Repository } from 'typeorm';
import { Broad, BroadResponse } from '../../interfaces/BroadReponse.interface';
import { ConfigService } from '../../config/config.service';
import { BroadDetailEntity } from './entities/broadDetail.entity';
import { BroadEntity } from './entities/broad.entity';

export interface BroadResolveObject {
  totalCount: number, pages: number, nowPage: number
}

export class BroadService {
  private broadUrl = 'https://openapi.afreecatv.com/broad/list';

  private broadList: Broad[];

  private broadRepository: Repository<BroadDetailEntity>

  constructor(
    private configService: ConfigService,
  ) {
    this.broadList = [];
    this.broadRepository = getRepository(BroadDetailEntity);
  }

  /**
   * 데이터 요청 시 필요한 헤더 및 파라미터를 제작하는 함수
   * @param page 헤더 및 파리미터로 설정할 페이저 넘버
   * @author hwasurr
   */
  private makeRequestParams(page?: number): AxiosRequestConfig {
    return {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: '*/*',
      },
      params: {
        client_id: this.configService.getValue('AFREECA_KEY'),
        page_no: page,
        order_type: 'broad_start', // 'view_cnt' or 'broad_start'
      },
    };
  }

  /**
   * 방송 리스트 데이터 요청 함수.
   * @param page 요청할 페이지 넘
   * @author hwasurr버
   */
  private getBroadList(page?: number) {
    const requestOptions = this.makeRequestParams(page);

    return new Promise<BroadResolveObject>((resolve, reject) => {
      Axios.get<BroadResponse>(this.broadUrl, requestOptions)
        .then((res) => {
          if (Object.prototype.hasOwnProperty.call(res.data, 'broad')) {
            res.data.broad.forEach((element) => {
              this.broadList.push(element);
            });

            resolve({
              totalCount: res.data.total_cnt,
              pages: Math.round(res.data.total_cnt / 60) + 2, // 오차범위 2
              nowPage: res.data.page_no,
            });
          } else {
            reject(res.data.total_cnt);
          }
        })
        .catch((err) => {
          console.error('error occuerred during broad list request\n', err);
        });
    });
  }

  /**
   * 방송 정보 모두 가져오는 함수
   * @author hwasurr
   */
  public async getAll(): Promise<Broad[]> {
    // 첫 데이터 요청
    await this.getBroadList()
      .then(async (result) => {
        console.info(`총 가져올 방송 데이터: ${result.totalCount}, 총 페이지: ${result.pages}`);

        // 2 페이지 부터 요청
        const broadPromises = [...Array(result.pages).keys()].slice(2)
          .map(async (page) => {
            const res = await this.getBroadList(page);
            return res;
          });

        await Promise.all(broadPromises);
      });

    return this.broadList;
  }

  /**
   * 아프리카로부터 받아온 방송 리스트 데이터 어레이의
   * 각 방송 객체를 Broad Entity로 변경하는 함수.
   * @param broadList 방송Entity로 변환할 방송 리스트 데이터 어레이
   * @author hwasurr
   */
  private nativeToEntity(broadList?: Broad[]): BroadEntity[] {
    return broadList.map((broad) => ({
      broadId: broad.broad_no,
      firstTitle: broad.broad_title,
      broadStartedAt: broad.broad_start,
      userId: broad.user_id,
      userNick: broad.user_nick,
    }));
  }

  /**
   * 아프리카로부터 받아온 방송 리스트 데이터 어레이의
   * 각 방송 객체를 Broad Detail Entity로 변경하는 함수.
   * @param broadList 방송Entity로 변환할 방송 리스트 데이터 어레이
   * @author hwasurr
   */
  private nativeToDetailEntity(broadList?: Broad[]): BroadDetailEntity[] {
    return broadList.map((broad) => ({
      title: broad.broad_title,
      visitBroadType: Number(broad.visit_broad_type),
      isPassword: Number(broad.is_password),
      broadCategory: broad.broad_cate_no,
      broadId: broad.broad_no,
      broadThumb: broad.broad_thumb,
      broadGrade: broad.broad_grade,
      broadBps: broad.broad_bps,
      broadResolution: broad.broad_resolution,
      viewCount: Number(broad.total_view_cnt),
    }));
  }

  /**
   * broadList 데이터 를 broad 테이블에 적재
   * @author hwasurr
   */
  private async saveBroad(): Promise<InsertResult> {
    return this.broadRepository.createQueryBuilder()
      .insert()
      .into(BroadEntity)
      .orUpdate({ conflict_target: ['broadId'], overwrite: ['broadId'] })
      .values(this.nativeToEntity(this.broadList))
      .execute();
  }

  /**
   * broadList 데이터 를 broadDetail 테이블에 적재
   * @author hwasurr
   */
  private async saveBroadDetail(): Promise<InsertResult> {
    return this.broadRepository
      .createQueryBuilder()
      .insert()
      .into(BroadDetailEntity)
      .values(this.nativeToDetailEntity(this.broadList))
      .execute();
  }

  /**
   * 아프리카로부터 받아온 방송 리스트 데이터를 데이터 베이스로 적재하는 함수.
   * @param broadList DB적재할 방송 리스트 데이터 어레이
   * @author hwasurr
   */
  public async saveAll(): Promise<boolean> {
    try {
      // Insert afreecaBroad
      await this.saveBroad();

      // Insert afreecaBroadDetail
      await this.saveBroadDetail();

      return true;
    } catch (e) {
      throw new Error('Error occurred during save the data through this method - saveAll');
    }
  }
}
