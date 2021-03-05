import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  getConnection,
  Repository,
} from 'typeorm';
// import { Rankings } from '@truepoint/shared/dist/interfaces/Rankings.interface';
import { RankingsEntity } from './entities/rankings.entity';

type ScoreColumn = 'smileScore'|'frustrateScore'|'admireScore'|'cussScore';
interface MonthlyRankData{
  creatorName: string;
  creatorId: string;
  platform: 'twitch' | 'afreeca';
  avgScore: number;
}

interface TopTenRankData{
  creatorId: string;
  id: number;
  platform: string;
  creatorName: string;
  title: string;
  streamDate: Date;
  smileScore: number;
}

interface DailyTotalViewerData{
  creatorId: string;
  creatorName: string;
  maxViewer: number;
}

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(RankingsEntity)
    private readonly rankingsRepository: Repository<RankingsEntity>,
  ) {}

  /**
   * 월간 월간 웃음/감탄/답답함 점수 순위 구할 때 사용할 기본 쿼리
   * 
   * 현재 기준으로 1개월 내에 생성된 데이터에 대하여
   * creatorName, creatorId, platform정보를 
   * 5개 가져오도록 한다
   */
  private monthlyScoreBaseQuery = this.rankingsRepository
    .createQueryBuilder('rankings')
    .select('creatorName')
    .addSelect('creatorId')
    .addSelect('platform')
    .where('createDate >= DATE_SUB(NOW(), INTERVAL 1 MONTH)')
    .groupBy('creatorName')
    .take(5);

  /**
   * monthlyScoreBaseQuery 기본 쿼리를 바탕으로
   * 월간 평균점수컬럼을 추가하고, 
   * 해당 평균점수 별로 내림차순 정렬하여 값을 가져온다
   * @param column 'smileScore'|'frustrateScore'|'admireScore'
   * @return MonthlyRankData[]
    {
      "creatorName": "랄로",
      "creatorId": "fkffh",
      "platform": "twitch",
      "avgScore": 9.3595
    }[]
   */
  async getMonthlyRankByColumn(column: ScoreColumn): Promise<MonthlyRankData[]> {
    const decimalPlace = 2;// 평균점수 소수점 2자리까 자른다
    try {
      return await this.monthlyScoreBaseQuery.clone()
        .addSelect(`TRUNCATE(AVG(${column}),${decimalPlace})`, 'avgScore')
        .orderBy('avgScore', 'DESC')
        .getRawMany();
    } catch (error) {
      throw new InternalServerErrorException('error in getMonthlySmileRank');
    }
  }

  /**
   * 지난 월간 웃음/감탄/답답함 평균점수 상위 5명씩 뽑아서 반환 -> 지난 월간 웃음점수/감탄점수/답답함점수 막대그래프에 사용
   * @return 
   * {
   * smile: MonthlyRankData[],
     frustrate: MonthlyRankData[],
     admire: MonthlyRankData[]
   * }
   */
  async getMonthlyScoresRank(): Promise<{
    smile: MonthlyRankData[],
    frustrate: MonthlyRankData[],
    admire: MonthlyRankData[]
  }> {
    const smile = await this.getMonthlyRankByColumn('smileScore');
    const frustrate = await this.getMonthlyRankByColumn('frustrateScore');
    const admire = await this.getMonthlyRankByColumn('admireScore');
    return {
      smile,
      frustrate,
      admire,
    };
  }

  /**
   * 24시간 내 해당 점수 상위 10명의 방송정보를 뽑아내는 함수
   * 
   * 최근 24시간 내 방송에 대해 크리에이터별로 최고 점수를 구한 테이블(t2)을 만들고
   * rankings테이블(t1)에서 최고 점수(t2.maxScore)인 데이터를 가져와
   * 점수순으로 내림차순하여 10개를 가지고온다
   * 
   * @param column "smileScore" | "frustrateScore" | "admireScore" | "cussScore"
   * @return {
      rankingData : TopTenRankData[]
      weeklyTrends : {[key:string] : [ { createDate: string; [key:ScoreColumn]: number }]}
   }
   */
  async getTopTenByColumn(column: ScoreColumn): Promise<any> {
    const rankingData = await getConnection()
      .createQueryBuilder()
      .from(RankingsEntity, 't1')
      .select([
        `t1.${column} AS ${column}`,
        't1.id AS id',
        't1.creatorId AS creatorId',
        't1.creatorName AS creatorName',
        't1.title AS title',
        't1.createDate AS createDate',
        't1.platform AS platform',
      ])
      .addFrom((subQuery) => subQuery // 최근 24시간 내 방송을 creatorId별로 그룹화하여 creatorId와 최대점수를 구한 테이블(t2)
        .select([
          `MAX(rankings.${column}) AS maxScore`,
          'rankings.creatorId AS creatorId',
        ])
        .from(RankingsEntity, 'rankings')
        .groupBy('rankings.creatorId')
        .where('createDate >= DATE_SUB(NOW(), INTERVAL 1 DAY)'),
      't2')
      .where('t1.creatorId = t2.creatorId')
      .andWhere(`t1.${column} = t2.maxScore`) // 최대점수를 가지는 레코드의 정보를 가져온다(t2와 t1의 creatorId와 점수가 같은 레코드)
      .orderBy(`t1.${column}`, 'DESC')
      .take(10)
      .getRawMany();

    // 상위 10명 크리에이터의 아이디를 뽑아낸다
    const topTenCreatorIds = rankingData.map((d) => d.creatorId);
    // 상위 10명 크리에이터의 최근 7개 방송 점수 동향을 구함
    const weeklyTrends = await this.getTopTenTrendsByColumn(topTenCreatorIds, column);

    return {
      rankingData,
      weeklyTrends,
    };
  }

  /**
   * 상위 10인의 creatorId를 받아와 해당 방송인의 최근 7개방송 날짜와 점수를 찾는다
   * 
   * Rankings 테이블에서 상위 10인 creatorId인 데이터에 대하여
   * 해당 점수, 날짜, creatorId, 순위(크리에이터별로 묶어서 최신순으로 매김 - 최근 7개 방송을 가져오기 위해서) 가지고 있는 테이블(t)를 만든다
   * 테이블 t에 대하여 순위가 7 이하인 값들(=최근 7개 방송 데이터)을 가져온다
   * 
   * @param topTenCreatorIds 상위 10인의 creatorId array
   * @param column 기준 점수 컬럼 "smileScore" | "frustrateScore" | "admireScore" | "cussScore"
   * @return {[key:string] : [ { createDate: string; [key:ScoreColumn]: number }]}
   * 예시: { creatorId: [ {createDate: "2021-3-5", cussScore: 9.861}, ... ], }
   */
  async getTopTenTrendsByColumn(topTenCreatorIds: string[], column: ScoreColumn): Promise<any> {
    const data = await getConnection()
      .createQueryBuilder()
      .select([
        't.creatorId',
        't.createDate',
        `t.${column}`,
      ])
      .from((subQuery) => subQuery
        .from(RankingsEntity, 'r')
        .select([
          `r.${column} AS ${column}`,
          'DATE_FORMAT(r.createDate,"%Y-%c-%e") AS createDate',
          'r.creatorId AS creatorId',
          'RANK() OVER(PARTITION BY r.creatorId ORDER BY r.createDate DESC) AS rnk',
        ])
        .where(`r.creatorId IN ('${topTenCreatorIds.join("','")}')`),
      't')
      .where('t.rnk <= 7')
      .getRawMany();

    // 가져온 데이터를 { creatorId: [ {createDate: "2021-3-5", cussScore: 9.861}, ... ], } 형태로 변환함
    const result = topTenCreatorIds.reduce((obj, key) => ({ ...obj, [key]: [] }), {});
    data.forEach((d) => {
      const { creatorId, createDate } = d;
      result[creatorId].push({ createDate, [column]: d[column] });
    });

    return result;
  }

  /**
   * 감탄점수/웃음점수/답답함점수/욕점수 상위 10명 뽑아서 반환 -> 반응별랭킹 TOP 10에 사용
   * @return  { smile: TopTenRankData[],admire: TopTenRankData[],frustrate: TopTenRankData[],cuss: TopTenRankData[]}
   */
  async getTopTenRank(): Promise<any> {
    // 웃음점수 상위 10명 
    const smile = await this.getTopTenByColumn('smileScore');
    // // 감탄점수 상위 10명
    const admire = await this.getTopTenByColumn('admireScore');
    // 답답함점수 상위 10명
    const frustrate = await this.getTopTenByColumn('frustrateScore');
    // 욕점수 상위 10명
    const cuss = await this.getTopTenByColumn('cussScore');

    return {
      smile, admire, frustrate, cuss,
    };
  }

  /**
   * Rankings테이블에서 
   * 해당 플랫폼이면서 최근 24시간 내 방송에 대하여
   * creatorId별로 그룹화하여 최대 시청자수 구하고,
   * 최대시청자수 내림차순으로 정렬하여 
   * 10개의 데이터(최대시청자수 상위10인)의 데이터를 가져옴
   * 
   * 시청자 수 상위 10인의 최대 시청자 수, 활동명, creatorId
   * && 해당 플랫폼의 상위10인 총 시청자수 합 반환
   * 
   * @param platform 'twitch'|'afreeca'
   * @return
   * {
   * data: DailyTotalViewerData[], // 시청자 수 상위 10인의 최대 시청자 수,활동명,creatorId
     total: number // 해당 플랫폼의 상위10인 총 시청자수 합
   * }
   * 
   */
  async getDailyTotalViewersByPlatform(platform: 'twitch'|'afreeca'): Promise<
  {
    data: DailyTotalViewerData[],
    total: number
  }
  > {
    const data = await this.rankingsRepository
      .createQueryBuilder('rankings')
      .select([
        'MAX(rankings.viewer) AS maxViewer',
        'rankings.creatorName AS creatorName',
        'rankings.creatorId AS creatorId',
      ])
      .where('rankings.platform =:platform', { platform })
      .andWhere('createDate >= DATE_SUB(NOW(), INTERVAL 1 DAY)') // 최근 24시간에 대해서
      .groupBy('rankings.creatorId')
      .orderBy('maxViewer', 'DESC')
      .take(10)
      .getRawMany();
    return {
      data,
      total: data.reduce((sum, item) => sum + item.maxViewer, 0),
    };
  }

  /**
   * 최근 24시간 내 플랫폼별 최대시청자 10인의 총 시청자수 합 & 개별 최대시청자 정보 반환 
   * -> 플랫폼별 상위 10인의 시청자수 합 카드에 사용
   * @return 
   * {
   *  twitch: { data: [ {"maxViewer": 12248, "creatorName": "꽃핀","creatorId": "Rhcvls"}, ...],
   *            total : number },
   *  afreeca: { data: [ {"maxViewer": 12248, "creatorName": "꽃핀","creatorId": "Rhcvls"}, ...], 
   *            total: number }
   * }
   */
  async getDailyTotalViewers(): Promise<any> {
    const twitch = await this.getDailyTotalViewersByPlatform('twitch');
    const afreeca = await this.getDailyTotalViewersByPlatform('afreeca');

    return { twitch, afreeca };
  }

  /**
   * 주간 시청자수 랭킹 구하는 함수 -> 주간 시청자수 랭킹 카드에 사용됨
   * 
   * rankings테이블에서 생성날짜가 최근 7일 내인 데이터를
   * 생성날짜, 최대시청자수로 정렬 & 크리에이터별, 날짜별로 그룹화하여(A),
   * 최대시청자 순으로 rank를 매기고(B),
   * 날짜와 해당 날의 상위10인(rank <= 10)의 최대시청자수 총합을 가져와 플랫폼별, 날짜별로 그룹화함
   * 
   * @return 최근 7일 내 플랫폼별 & 날짜별 시청자수 상위 10인의 시청자수 총합
   * {
   * afreeca: [{date:'2021-3-4',totalViewer:'23432'}, {date:'2021-3-3',totalViewer:'1235'}, ... ],
   * twitch: [{date:'2021-3-4',totalViewer:'1234'}, {date:'2021-3-3',totalViewer:'3432'}, ... ]
   * }
   */
  async getWeeklyViewers(): Promise<any> {
    const query = `
    SELECT platform, cdate AS "date", SUM(maxViewer) AS totalViewer
    FROM(
      SELECT A.*, ROW_NUMBER() OVER (partition by cdate, platform order by maxViewer DESC) AS "rank"
      FROM (
        SELECT creatorId, createDate, platform, MAX(viewer) AS maxViewer, DATE_FORMAT(createDate,"%Y-%c-%e") AS cdate
        FROM Rankings
        WHERE createDate >= DATE_SUB(NOW(), INTERVAL 1 WEEK)
        Group by creatorId, cdate
        Order by platform, cdate DESC, maxViewer DESC
      ) AS A
    ) AS B
    where "rank" <= 10 
    group by platform, cdate
    order by platform, cdate DESC;`;

    const data = await getConnection().query(query);
    const result = { afreeca: [], twitch: [] };
    data.forEach((item) => {
      result[item.platform].push({ date: item.date, totalViewer: item.totalViewer });
    });
    return result;
  }

  /**
   * 가짜데이터 넣기 위해 임시로 만든 함수
   * 플랫폼별 임의로 10명정도의 크리에이터이름과 아이디를 넣어두고
   * 랜덤 시청자수와 점수를 생성
   * 
   * @param platform 'twitch' | 'afreeca'
   * @param dayDiff 생성날짜를 오늘로부터 며칠전으로 할 것인지
   * 0 : 오늘날짜로 생성날짜 지정, 
   * 1 : 오늘로부터 1일전으로 생성날짜 지정...
   */
  async insert(platform: string, dayDiff: number): Promise<any> {
    const twitch = [
      { creatorName: '소행성', creatorId: 'thgodtjd' },
      { creatorName: '철면수심', creatorId: 'cjfaustntla' },
      { creatorName: '탬탬버린', creatorId: 'xoaxoaqjfls' },
      { creatorName: '머독', creatorId: 'ajehr' },
      { creatorName: '웁_게임방송', creatorId: 'dnq_rpdlaqkdthd' },
      { creatorName: '치킨쿤', creatorId: 'clzlszns' },
      { creatorName: '꽃핀', creatorId: 'Rhcvls' },
      { creatorName: '따효니', creatorId: 'Ekgysl' },
      { creatorName: '다주', creatorId: 'ekwn' },
      { creatorName: '개복어', creatorId: 'roqhrdj' },
    ];
    const afreeca = [
      { creatorName: '임아니', creatorId: 'dladksl' },
      { creatorName: '범프리카', creatorId: 'qjavmflzk' },
      { creatorName: '에디린', creatorId: 'dpelfls' },
      { creatorName: '신나린', creatorId: 'tlsskfls' },
      { creatorName: 'bj샤코타임1', creatorId: 'bjtizhxkdla1' },
      { creatorName: 'bj타요', creatorId: 'bjxkdy' },
      { creatorName: '대세는bj세야', creatorId: 'eotpsmsbjtpdi' },
      { creatorName: 'az형태형', creatorId: 'az형태형' },
      { creatorName: '나는푸르', creatorId: 'sksmsvnfm' },
      { creatorName: 'flash이영호', creatorId: 'flashdldudgh' },
      { creatorName: '예능인최군', creatorId: 'dPsmddlschlrns' },
      { creatorName: '유혜디', creatorId: 'dbgPel' },
    ];
    const today = new Date();
    const createDate = new Date(today);
    createDate.setDate(createDate.getDate() - dayDiff);

    function getRandomViewer() {
      return Math.round(Math.random() * 15000);
    }
    function getRandomScore() {
      return Number((Math.random() * 10).toFixed(3));
    }
    const baseArr = platform === 'afreeca' ? afreeca : twitch;
    const values = baseArr.map((d) => ({
      ...d,
      platform,
      title: `${d.creatorName} 방송 ${createDate.toISOString()}`,
      createDate,
      streamDate: createDate,
      viewer: getRandomViewer(),
      smileScore: getRandomScore(),
      frustrateScore: getRandomScore(),
      admireScore: getRandomScore(),
      cussScore: getRandomScore(),
    }));

    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(RankingsEntity)
        .values(values)
        .execute();
      return true;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('error in insert');
    }
  }
}
