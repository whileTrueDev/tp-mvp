import * as AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import {
  HttpException, HttpStatus, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as archiver from 'archiver';
import { HighlightPointListResType } from '@truepoint/shared/res/HighlightPointListResType.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';
import { StreamsEntity } from '../stream-analysis/entities/streams.entity';
import { UsersService } from '../users/users.service';

dotenv.config();
const s3 = new AWS.S3();

@Injectable()
export class HighlightService {
  private usersService: UsersService;

  constructor(
    @InjectRepository(StreamsEntity)
    private readonly streamsRepository: Repository<StreamsEntity>,
    private moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.usersService = this.moduleRef.get(UsersService, { strict: false });
  }

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

    // getArry가 빈 배열일 경우 - 분석된 데이터가 없는것으로 보고
    // 에러 발생시킴
    if (!getArray.length) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: '데이터가 없습니다',
      }, HttpStatus.NOT_FOUND);
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

  /**
   * 유투브 편집점 페이지 편집점 제공 목록
   * 해당 플랫폼에서 크리에이터당 최신 방송날짜를 가져온다
   * @param platform 'afreeca' | 'twitch'
   * 
   * @return HighlightPointListResType[]
   * {   
   *  creatorId: string, // 크리에이터 ID
      platform: string, // 플랫폼 'afreeca' | 'twitch'
      userId: string,   // userId
      title: string,   // 가장 최근 방송 제목
      endDate: Date,   // 가장 최근 방송의 종료시간
      nickname: string // 크리에이터 활동명
      logo: string // 크리에이터 로고
   * }[]
   */
  async getHighlightPointList({
    platform, page, take, search,
  }: {
    platform: 'afreeca'|'twitch',
    page: number,
    take: number,
    search: string
  }): Promise<HighlightPointListResType> {
    try {
      const matchingId = `${platform}Id`;
      const qb = await this.streamsRepository.createQueryBuilder('streams')
        .leftJoinAndSelect(UserEntity, 'users', `streams.creatorId = users.${matchingId}`)
        .select([
          'streams.creatorId AS creatorId',
          'streams.platform AS platform',
          'streams.title AS title',
          'MAX(streams.endDate) AS endDate',
          'users.userId AS userId',
          'users.nickName AS nickname',
        ])
        .where('streams.platform = :platform', { platform })
        .andWhere('streams.needAnalysis = 0') // needAnalysis 가 0인 stream 데이터만
        .andWhere('users.nickName like :search', { search: `%${search}%` })
        .groupBy('streams.creatorId')
        .orderBy('MAX(streams.endDate)', 'DESC');

      const totalCount = (await qb.clone().getRawMany()).length;
      const totalPage = Math.ceil(totalCount / take);
      const hasMore = page < totalPage;

      const dataWithoutProfileImage = await qb
        .offset((page - 1) * take)
        .limit(take)
        .getRawMany(); // skip, take 안먹음

      const userHighlightData = Promise.all(dataWithoutProfileImage.map(async (row) => {
        const getUserProfileImage = await this.usersService.findOneProfileImage(row.userId);
        return { ...row, logo: getUserProfileImage[0].logo };
      }));

      const res = {
        data: await userHighlightData,
        totalCount,
        page,
        take,
        totalPage,
        hasMore,
      };
      return res;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Error in getHighlightPointList');
    }
  }
}
