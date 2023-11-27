import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AUTH_MESSAGE } from 'src/messages/auth.message';
import { LocalesService } from '../locales/locales.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ILogin } from 'src/interfaces/auth.interface';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { EUserRole } from 'src/common/enums';

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
  ): Promise<any> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<any> {
    const hash = await this.authService.verifyOtp(verifyOtpDto);
    return {
      message: this.localesService.translate(AUTH_MESSAGE.VERIFY_OTP_SUCCESS),
      data: hash,
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPassword: ResetPasswordDto): Promise<any> {
    const hash = await this.authService.resetPassword(resetPassword);
    return {
      message: this.localesService.translate(
        AUTH_MESSAGE.RESET_PASSWORD_SUCCESS,
      ),
      data: hash,
    };
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @AuthDecorator([EUserRole.ADMIN, EUserRole.USER])
  async changePassword(
    @Body() changePassword: ChangePasswordDto,
    @UserDecorator('id') userId: number,
  ): Promise<any> {
    const hash = await this.authService.changePassword(userId, changePassword);
    return {
      message: this.localesService.translate(
        AUTH_MESSAGE.CHANGE_PASSWORD_SUCCESS,
      ),
      data: hash,
    };
  }
}
