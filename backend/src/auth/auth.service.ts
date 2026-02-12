import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 查询用户
    const user = await this.prisma.user.findUnique({
      where: { username }
    });

    // 验证用户和密码
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成双 token
    const tokens = await this.generateTokens(user.id.toString(), user.username);

    return {
      ...tokens,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        avatar: user.avatar,
      }
    };
  }

  /**
   * 刷新 token
   */
  async refreshToken(refreshToken: string) {
    try {
      // 验证 refresh_token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.TOKEN_SECRET
      });

      if (payload) {
        return this.generateTokens(payload.sub, payload.username);
      }
    } catch (e) {
      throw new UnauthorizedException('Refresh token 已失效，请重新登录');
    }
  }

  /**
   * 生成双 token (access_token + refresh_token)
   */
  private async generateTokens(id: string, username: string) {
    const payload = {
      sub: id,
      username
    };

    const [accessToken, refreshToken] = await Promise.all([
      // access_token: 15分钟有效期
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.TOKEN_SECRET
      }),
      // refresh_token: 7天有效期
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.TOKEN_SECRET
      })
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
