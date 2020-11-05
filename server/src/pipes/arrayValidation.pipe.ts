import {
  ArgumentMetadata, HttpException, mixin, PipeTransform, Type, ValidationPipe,
} from '@nestjs/common';
import { memoize } from 'lodash';

function createArrayValidationPipe<T>(itemType: Type<T>): Type<PipeTransform> {
  class MixinArrayValidationPipe extends ValidationPipe implements PipeTransform {
    transform(values: T[], metadata: ArgumentMetadata): Promise<any[]> {
      if (!Array.isArray(values)) {
        // console.log('[Error in ArrayValidationPipe] not array type ... ');
        return values;
      }

      return Promise.all(values.map((value) => (
        // console.log('inner', metadata);
        // console.log('meta type ', itemType);
        super.transform(value, { ...metadata, metatype: itemType })
          .catch((err) => {
            // console.log('[Error in ArrayValidationPipe] 400 Bad req in Array ... ', err);
            throw new HttpException('Error in ArrayValidationPipe 400 Bad req in Array ... ', 400);
          }))));
    }
  }

  return mixin(MixinArrayValidationPipe);
}

export const ArrayValidationPipe: <T>(itemType: Type<T>) => Type<PipeTransform> = memoize(createArrayValidationPipe);
