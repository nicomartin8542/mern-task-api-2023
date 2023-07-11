import {
  IsDate,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';

export class CreateProyectDto {
  @IsString()
  @MinLength(6)
  name: string;

  @IsString()
  @MinLength(6)
  description: string;

  @IsString()
  @MinLength(6)
  cliente: string;

  @IsDate()
  @IsOptional()
  fechaEtrega: Date;

  //   @IsMongoId({ each: true })
  //   @IsOptional()
  //   collaborators: mongoose.Schema.Types.ObjectId[];
}
