import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { ReadNoticeOutlineDto } from './dto/readNoticeOutline.dto';
import { FeatureEntity } from './entities/feature.entity';
import { DUMMY } from './feature.mock';
@Injectable()
export class FeatureService {
  // constructor(
  //   @InjectRepository(FeatureEntity)
  //   private readonly FeatureRepository: Repository<FeatureEntity>,
  // ) { }
  getData(): Promise<any> {
    return new Promise((resolve) => {
      resolve(DUMMY);
    });
  }
  // getData(): Promise<any> {
  //   const id = Number(courseId);
  //   return new Promise((resolve) => {
  //     const course = this.courses.find((course) => course.id === id);
  //     if (!course) {
  //       throw new HttpException('Course does not exist', 404);
  //     }
  //     resolve(course);
  //   });
  // }
}
