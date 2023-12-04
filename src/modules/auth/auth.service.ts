import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ErrorHelper } from 'src/helpers';
import { AUTH_MESSAGE } from 'src/messages/auth.message';
import { LocalesService } from '../locales/locales.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dtos/login.dto';
import { ILogin } from 'src/interfaces/auth.interface';
import { NodemailerService } from '../nodemailer/nodemailer.service';
import { CommonHelper } from 'src/helpers/common.helper';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import {
  MAIL_EXPIRE_TIME,
  MAIL_SUBJECT,
  MAIL_TEMPLATE,
  SALT_ROUNDS,
} from 'src/constants';
import * as moment from 'moment';
import { EMomentFormat, EMomentUnit } from 'src/common/enums';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { USER_MESSAGE } from 'src/messages';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly localesService: LocalesService,
    private readonly nodemailerService: NodemailerService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILogin> {
    const { email, password } = loginDto;
    const user = await this.usersService.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.LOGIN_FAIL),
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.LOGIN_FAIL),
      );
    }
    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword({ email }: ForgotPasswordDto): Promise<string> {
    const user = await this.usersService.findOne({
      email,
    });
    if (!user) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.EMAIL_NOT_REGISTER),
      );
    }

    const otpCode = CommonHelper.generateOTP();
    const expireTime = moment().add(
      MAIL_EXPIRE_TIME.VERIFY_OTP,
      EMomentUnit.MINUTES,
    );

    const hash = CommonHelper.hashData(
      JSON.stringify({
        email: user.email,
        expireTime,
        otpCode: otpCode,
      }),
    );
    await this.nodemailerService.sendMail({
      to: user.email,
      subject: MAIL_SUBJECT.VERIFY_OTP,
      template: MAIL_TEMPLATE.FORGOT_PASSWORD,
      context: {
        name: `${user.firstName} ${user.lastName}`,
        expireTime: expireTime.format(EMomentFormat.LLLL),
        otpCode,
      },
    });

    return hash;
  }

  async verifyOtp({ otpCode, hash }: VerifyOtpDto): Promise<string> {
    const jsonData = CommonHelper.checkHashData(hash);
    if (!jsonData) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.VERIFY_OTP_FAIL),
      );
    }
    const data = JSON.parse(jsonData);
    const expireTime = moment(data.expireTime);
    const currentTime = moment();
    if (currentTime >= expireTime || data.otpCode !== otpCode) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.VERIFY_OTP_INCORRECT),
      );
    }
    return hash;
  }

  async resetPassword({
    hash,
    password,
    confirmPassword,
  }: ResetPasswordDto): Promise<User> {
    if (confirmPassword !== password) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.PASSWORD_NOT_MATCH),
      );
    }
    const jsonData = CommonHelper.checkHashData(hash);
    if (!jsonData) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.RESET_PASSWORD_FAIL),
      );
    }
    const data = JSON.parse(jsonData);
    const user = await this.usersService.findOne({
      email: data.email,
    });
    if (!user) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(AUTH_MESSAGE.RESET_PASSWORD_FAIL),
      );
    }
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return this.usersService.updateOne({
      where: {
        id: user.id,
      },
      data: {
        password: hashPassword,
      },
    });
  }

  async changePassword(
    userId: number,
    { password, confirmPassword }: ChangePasswordDto,
  ): Promise<User> {
    if (confirmPassword !== password) {
      ErrorHelper.BadRequestException(
        this.localesService.translate(USER_MESSAGE.PASSWORD_NOT_MATCH),
      );
    }
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return this.usersService.updateOne({
      where: {
        id: userId,
      },
      data: {
        password: hashPassword,
      },
    });
  }
}
