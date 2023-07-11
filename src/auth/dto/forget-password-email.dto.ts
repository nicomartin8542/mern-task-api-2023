import { IsEmail, IsString } from 'class-validator';

export class ForgetPasswordEmailDto {
  @IsEmail()
  @IsString()
  email: string;
}
