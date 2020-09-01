import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CatEntity } from './entities/cat.entity';
import { UpdateCatDto } from './dto/updateCat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity) private readonly catsRepository: Repository<CatEntity>
  ) {}

  async create(cat: CatEntity): Promise<CatEntity> {
    return this.catsRepository.save(cat);
  }

  async update(updateCatDto: UpdateCatDto): Promise<CatEntity> {
    return this.catsRepository.save(updateCatDto);
  }

  async delete(id: number): Promise<CatEntity[]> {
    const targetCat = await this.catsRepository.find({ id });
    return this.catsRepository.remove(targetCat);
  }

  async findAll(): Promise<CatEntity[]> {
    return this.catsRepository.find();
  }

  async findOne(id: string): Promise<CatEntity> {
    return this.catsRepository.findOne(id);
  }
}
