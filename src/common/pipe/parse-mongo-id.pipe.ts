import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string, data: ArgumentMetadata) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Mongo id its not valid!');
    }

    return value;
  }
}
