import {
  PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Type
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private types: Type<any>[] = [String, Boolean, Number, Array, Object];

  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation Failed');
    }
    return value;
  }

  private toValidate(
    metatype:
      Type<any>
  ): boolean {
    return !this.types.includes(metatype);
  }
}
