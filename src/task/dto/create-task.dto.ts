import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @IsString()
  @MinLength(6)
  name: string;

  @IsString()
  @MinLength(6)
  description: string;

  @IsDateString()
  fechaEntrega: Date;

  @IsString()
  @IsIn(['Alta', 'Media', 'Baja'])
  prioridad: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;

  @IsMongoId()
  proyect: Types.ObjectId;
}
