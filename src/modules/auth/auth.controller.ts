import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { UserDecorator } from '../../common/decorators/user.decorator';
import { EUserRole } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ILogin } from 'src/interfaces/auth.interface';
import { AUTH_MESSAGE } from 'src/messages/auth.message';
import { LocalesService } from '../locales/locales.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly localesService: LocalesService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{
    message: string;
    data: ILogin;
  }> {
    return {
      message: this.localesService.translate(AUTH_MESSAGE.LOGIN_SUCCESS),
      data: await this.authService.login(loginDto),
    };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<string> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<{
    message: string;
    data: string;
  }> {
    const hash = await this.authService.verifyOtp(verifyOtpDto);
    return {
      message: this.localesService.translate(AUTH_MESSAGE.VERIFY_OTP_SUCCESS),
      data: hash,
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<{
    message: string;
    data: User;
  }> {
    const user = await this.authService.resetPassword(resetPassword);
    return {
      message: this.localesService.translate(
        AUTH_MESSAGE.RESET_PASSWORD_SUCCESS,
      ),
      data: user,
    };
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.USER])
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @UserDecorator('id') userId: number,
  ): Promise<{
    message: string;
    data: User;
  }> {
    const user = await this.authService.changePassword(userId, changePassword);
    return {
      message: this.localesService.translate(
        AUTH_MESSAGE.CHANGE_PASSWORD_SUCCESS,
      ),
      data: user,
    };
  }
}
