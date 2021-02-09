import {
  Controller,
  // Get,
  Post,
  Body,
  // Put,
  // Param,
  // Delete,
} from '@nestjs/common';
import { CommunityBoardService } from './communityBoard.service';
import { CreateCommunityPostDto } from './dto/createCommunityPost.dto';
// import { UpdateCommunityPostDto } from './dto/updateCommunityPost.dto';

@Controller('community')
export class CommunityBoardController {
  constructor(private readonly communityBoardService: CommunityBoardService) {}

  @Post()
  create(@Body() createCommunityPostDto: CreateCommunityPostDto): Promise<CreateCommunityPostDto> {
    return this.communityBoardService.create(createCommunityPostDto);
  }

  // @Get()
  // findAll() {
  //   return this.communityBoardService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.communityBoardService.findOne(+id);
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateCommunityBoardDto: UpdateCommunityPostDto) {
  //   return this.communityBoardService.update(+id, updateCommunityBoardDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.communityBoardService.remove(+id);
  // }
}
