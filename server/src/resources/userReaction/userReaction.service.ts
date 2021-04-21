import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { UpdateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/updateUserReaction.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserReactionEntity } from './entities/userReaction.entity';

@Injectable()
export class UserReactionService {
  constructor(
    @InjectRepository(UserReactionEntity)
    private readonly userReactionRepository: Repository<UserReactionEntity>,
  ) {}

  /**
   * 시청자반응 가장 최신 데이터 10개를 시간 오름차순으로 반환
   * 최대 10개 반환함(데이터가 10개 미만인 경우 데이터가 존재하는 만큼 반환)
   * @return UserReactionEntity[]
   */
  async getUserReactions(): Promise<UserReactionEntity[]> {
    const data = await this.userReactionRepository.find({
      order: { createDate: 'DESC' },
      take: 20,
    });
    return data.reverse();
  }

  // 비밀번호 확인
  private async checkPassword(id: number, password: string): Promise<boolean> {
    const data = await this.userReactionRepository.findOne({
      where: { id },
      select: ['password'],
    });
    if (!data) {
      throw new BadRequestException(`no data with id ${id}`);
    }
    return bcrypt.compare(password, data.password);
  }

  /**
   * createUserReactionDto를 받아 새로운 UserReactions을 테이블에 저장(생성)
   * @return 새로 생성된 UserReactionEntity
   * @param createUserReactionDto 사용자가 입력한 값
   *  {username: string;
       content: string;} 
   * @param ip 컨트롤러에서 넘겨주는 ip
   */
  async createUserReactions(
    createUserReactionDto: CreateUserReactionDto,
    ip: string,
  ): Promise<UserReactionEntity> {
    const { password } = createUserReactionDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newReaction = {
      ...createUserReactionDto,
      password: hashedPassword,
      ip,
    };
    try {
      const reaction = await this.userReactionRepository.save(newReaction);
      return reaction;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('error in creating user reaction');
    }
  }

  /**
   * id값으로 userReaction을 찾아 내용을 수정하는 함수
   * 존재하지 않는 id로 실행할 경우 NotFoundError발생시킴
   * 수정 중 에러 발생시 InternalServerError발생시킴
   * @return 수정된 UserReactionEntity
   * @param id 수정할 userReaction의 id(PrimaryGeneratedColumn)
   * @param updateUserReactionDto 사용자가 입력한 값
   * {content: string;} 
   */
  async updateUserReaction(id: number, updateUserReactionDto: UpdateUserReactionDto): Promise<UserReactionEntity> {
    const data = await this.findOneUserReaction(id);
    try {
      const newData = await this.userReactionRepository.save({
        ...data,
        ...updateUserReactionDto,
      });
      return newData;
    } catch (error) {
      throw new InternalServerErrorException('error in updating user reaction');
    }
  }

  /**
   * id값으로 userReaction을 찾아 내용을 수정하는 함수
   * 존재하지 않는 id로 실행할 경우 NotFoundError발생시킴
   * 삭제 중 에러 발생시 InternalServerError발생시킴
   * 삭제 성공시 true값만을 반환함
   * @return true(삭제 성공시)
   * @param id 삭제할 userReaction의 id(PrimaryGeneratedColumn)
   */
  async deleteUserReaction(id: number): Promise<boolean> {
    const data = await this.findOneUserReaction(id);
    try {
      await this.userReactionRepository.remove(data);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('error in updating user reaction');
    }
  }

  /**
   * 해당 id인 데이터가 존재하는지 여부를 확인하는 함수
   * 하나의 데이터에 대해 수정/삭제 시 사용하기 위한 용도로 만듦
   * 존재하면 해당 데이터 반환,
   * 존재하지 않으면 notFoundError발생시킨다
   * 
   * @return UserReactionEntity(해당 id인 데이터가 존재하는 경우)
   * @param id 찾고자 하는 userReaction의 id(PrimaryGeneratedColumn)
   */
  async findOneUserReaction(id: number): Promise<UserReactionEntity> {
    const data = await this.userReactionRepository.findOne({ id });
    if (!data) {
      throw new BadRequestException(`no data with id ${id}`);
    }
    return data;
  }
}
