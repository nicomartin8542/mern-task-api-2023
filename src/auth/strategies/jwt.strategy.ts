import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private readonly userRepository: Model<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;

    //Recupero al usuario
    const user = await this.userRepository.findById(id);

    if (!user) throw new UnauthorizedException('User not valid!');

    if (!user.confimado)
      throw new UnauthorizedException(
        'User not confirm, please verify your mail!',
      );

    if (!user.isActive)
      throw new UnauthorizedException(
        'User is inactive, please contact with admin',
      );

    return user;
  }
}
