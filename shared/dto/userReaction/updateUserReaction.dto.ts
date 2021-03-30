import { PartialType } from '@nestjs/mapped-types';
import { CreateUserReactionDto } from './createUserReaction.dto';

export class UpdateUserReactionDto extends PartialType(CreateUserReactionDto) {}
