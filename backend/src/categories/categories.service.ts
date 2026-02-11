import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: { orderNum: 'asc' }
    });

    return {
      code: 200,
      msg: 'success',
      data: ['全部', ...categories.map(c => c.name)]
    };
  }
}
