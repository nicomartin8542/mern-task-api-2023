import { ConfigService } from '@nestjs/config';

export const JwtConfig = (configService: ConfigService) => {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: '2h',
    },
  };
};
