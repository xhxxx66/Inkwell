import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 从 Authorization header 提取 Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('TOKEN_SECRET') || 'inkwell-jwt-secret'
    });
  }

  // 验证通过后，将用户信息附加到 request.user
  async validate(payload: any) {
    return {
      id: payload.sub,
      username: payload.username
    };
  }
}
