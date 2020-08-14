import {
  Controller, Get, Post, Body
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cats.interface';
import { CreateCatDto } from './dto/cats.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async find(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Post()
  async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto): Promise<Cat> {
    return this.catsService.create(createCatDto);
  }
}
