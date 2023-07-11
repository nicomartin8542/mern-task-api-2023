import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto } from './dto';
import GenerateId from 'src/common/helpers/generate-id.helpers';
import { ForgetPasswordEmailDto } from './dto/forget-password-email.dto';
import { ConfirmPasswordDto } from './dto/confirm-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new this.userModel(createUserDto);
      user.token = GenerateId();
      const userDb = await user.save();
      return userDb;
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  async resetPassword(forgetPasswordEmailDto: ForgetPasswordEmailDto) {
    const { email } = forgetPasswordEmailDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Credentials Invalid');

    try {
      user.token = GenerateId();
      user.tokenRefresh = '';
      return await user.save();
    } catch (error) {
      console.log(error);
      this.handleExcepcionError(error);
    }
  }

  async confirmPassword(token: string, confirmPasswordDto: ConfirmPasswordDto) {
    const { password } = confirmPasswordDto;
    const user = await this.userModel.findOne({ token });
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    try {
      user.password = password;
      user.tokenRefresh = this.getJwtTokenRefresh(user._id);
      await user.save();
      user.token = this.getJwtToken(user._id);
      return user;
    } catch (error) {
      console.log(error);
      this.handleExcepcionError(error);
    }
  }

  async confirmUser(token: string) {
    const user = await this.userModel.findOne({ token });
    if (!user) throw new UnauthorizedException('Credentials Invalid');
    try {
      user.token = '';
      user.tokenRefresh = '';
      user.confimado = true;
      return await user.save();
    } catch (error) {
      console.log(error);
      this.handleExcepcionError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    //Recuero user por mail
    const user = await this.userModel
      .findOne({
        email,
      })
      .select('password confimado token tokenRefresh name email isActive');

    if (!user) throw new UnauthorizedException('Credentials invalid!');

    if (!user.confimado)
      throw new UnauthorizedException(
        'User not confirm, please verify your mail!',
      );

    if (!user.isActive)
      throw new UnauthorizedException(
        'User is inactive, please contact with admin',
      );

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials invalid!');

    try {
      user.tokenRefresh = this.getJwtTokenRefresh({ id: user.id });
      const userUpd = await user.save();
      userUpd.token = this.getJwtToken({ id: user.id });
      return userUpd;
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  findAll() {
    return this.userModel.find({});
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
  private getJwtTokenRefresh(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: this.config.get('JWT_SECRET'),
    });
    return token;
  }
  private handleExcepcionError(error: any): never {
    if (error.code === 11000)
      throw new BadRequestException('El usuario ya existe!');
    console.log(error);
    throw new InternalServerErrorException(error);
  }
}

// update(id: number, updateAuthDto: UpdateUserDto) {
//   return `This action updates a #${id} auth`;
// }

// remove(id: number) {
//   return `This action removes a #${id} auth`;
// }
