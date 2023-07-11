import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  ConfirmPasswordDto,
  ForgetPasswordEmailDto,
} from './dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from './docorators/auth.decorator';
import { GetUser } from './docorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('confirm-user/:token')
  confirm(@Param('token') token: string) {
    return this.authService.confirmUser(token);
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordEmailDto: ForgetPasswordEmailDto) {
    return this.authService.resetPassword(forgetPasswordEmailDto);
  }

  @Post('forget-password/:token')
  confirmPassword(
    @Param('token') token: string,
    @Body() confirmPasswordDto: ConfirmPasswordDto,
  ) {
    return this.authService.confirmPassword(token, confirmPasswordDto);
  }

  @Auth()
  @Get('user')
  findAll() {
    return this.authService.findAll();
  }

  @Auth()
  @Get('user/profile')
  findOne(@GetUser() user: User) {
    return user;
  }
}
