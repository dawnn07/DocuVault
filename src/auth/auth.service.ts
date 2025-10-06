import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';

import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userModel.findOne({
      email: dto.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      email: dto.email,
      password: hashedPassword,
      role: 'user',
      credits: 0,
    });

    const tokens = await this.generateTokens(user);

    return { tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      //eslint-disable-next-line
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      });

      const user = await this.userModel.findOne({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        id: payload.sub,
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);

      return { tokens };
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userModel.findOne({
      id: userId,
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;
    await this.userModel.updateOne(
      { id: userId },
      { password: hashedPassword }
    );

    return { message: 'Password changed successfully' };
  }

  private async generateTokens(user: UserDocument) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
          role: user.role,
        },
        {
          secret: process.env.JWT_SECRET || 'secret_key',
          expiresIn: '30d',
        }
      ),
      this.jwtService.signAsync(
        {
          sub: user._id,
          email: user.email,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
          expiresIn: '30d',
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
