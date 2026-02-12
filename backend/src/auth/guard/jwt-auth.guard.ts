import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 认证守卫
 * 自动解析 Authorization header 中的 Bearer token
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
