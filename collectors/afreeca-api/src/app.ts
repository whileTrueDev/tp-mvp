import { BroadService } from './resources/broad/broad.service';
import { ConfigService } from './config/config.service';
import { DatabaseConfigService } from './config/database.config';
import { DatabaseService } from './database/database.service';
import { CategoryService } from './resources/category/category.service';

export class App {
  configService: ConfigService;

  dbConfigService: DatabaseConfigService;

  dbService: DatabaseService;

  private async config(): Promise<void> {
    this.configService.config();
  }

  public async run(): Promise<App> {
    // Load Configurations
    this.configService = new ConfigService();
    this.config();

    // Connect Database
    this.dbConfigService = new DatabaseConfigService(this.configService);
    this.dbService = new DatabaseService(this.dbConfigService);
    // initialization
    await this.dbService.init();

    const broadService = new BroadService(this.configService);
    const categoryService = new CategoryService(this.configService);

    /**
     * Broad Data 가져오기
     * @crawlPeriod 매 3분 마다. ( 컨테이너 수준에서 처리. )
     */
    // 방송 정보 가져오기
    console.info('Start to get Broad data from afreeca tv');
    await broadService.getAll();
    console.info('successfully done - Broad getAll');

    /**
     * Category Data
     * @crawlPeriod 1일에 1번. 매 일 18시 0분 또는 1분 또는 2분.
     */
    // 방송 카테고리 정보 가져오기
    const alreadyInsertedCategories = await categoryService.findAll();
    if (
      (alreadyInsertedCategories.length <= 0) // 적재된 카테고리가 한개도 없거나
      // 특정 시간 (20시 0분 또는 1분 또는 2분) 인 경우에만 실행.
      || (new Date().getHours() === 20 && [0, 1, 2, 3].includes(new Date().getMinutes()))
    ) {
      console.info('Start to get Category data from afreeca tv');
      await categoryService.getAll();
      console.info('successfully done - Category getAll');

      // 방송 카테고리 정보 적재
      console.info('Start to save Category data');
      await categoryService.saveAll();
      console.info('successfully done - Category saveAll');
    } else {
      console.info('Skip collecting Category');
    }

    /**
     * Broad Data 적재
     * @crawlPeriod 매 3분 마다. ( 컨테이너 수준에서 처리. )
     */
    console.info('Start to save Broad data');
    await broadService.saveAll();
    console.info('successfully done - Broad saveAll');

    return this;
  }
}
