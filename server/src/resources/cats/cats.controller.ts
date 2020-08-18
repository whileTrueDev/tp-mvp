import {
  Controller, Get, Post, Patch, Body, UseGuards, Param, Delete, Request
} from '@nestjs/common';
import { LogedInExpressRequest } from '../../interfaces/logedInRequest.interface';
import { CatsService } from './cats.service';
import { CatEntity } from './entities/cat.entity';
import { CreateCatDto } from './dto/createCat.dto';
import { UpdateCatDto } from './dto/updateCat.dto';
import { DeleteCatDto } from './dto/deleteCat.dto';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async find(@Param('id') id: string): Promise<CatEntity | CatEntity[]> {
    if (id) {
      return this.catsService.findOne(id);
    }
    return this.catsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body(new ValidationPipe()) createCatDto: CreateCatDto,
    @Request() req: LogedInExpressRequest
  ): Promise<CatEntity> {
    const { user } = req;
    const insertCatInformation = { ...createCatDto, owner: user.userId };
    return this.catsService.create(insertCatInformation);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@Body(new ValidationPipe()) updateCatDto: UpdateCatDto): Promise<CatEntity> {
    return this.catsService.update(updateCatDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async delete(@Body(new ValidationPipe()) deleteCatDto: DeleteCatDto): Promise<CatEntity[]> {
    return this.catsService.delete(deleteCatDto.id);
  }
}
