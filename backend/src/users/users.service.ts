import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 用户注册
   */
  async register(createUserDto: CreateUserDto) {
    const { username, password, nickname } = createUserDto;

    // 检查用户名是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    // 密码加密 (bcrypt 单向加密，强度10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname: nickname || username,
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
        createdAt: true,
      }
    });

    return {
      code: 200,
      msg: '注册成功',
      data: user
    };
  }

  /**
   * 根据 ID 获取用户信息
   */
  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
        email: true,
        phone: true,
        gender: true,
        bio: true,
        createdAt: true,
      }
    });

    if (!user) {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      };
    }

    return {
      code: 200,
      msg: 'success',
      data: user
    };
  }
}
