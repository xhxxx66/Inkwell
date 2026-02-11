import { Injectable } from '@nestjs/common';
import { ChapterQueryDto } from './dto/chapter-query.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChaptersService {
  constructor(private prisma: PrismaService) {}

  // 获取书籍的章节列表
  async findByBookId(bookId: number, query: ChapterQueryDto) {
    const { page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const [total, chapters] = await Promise.all([
      this.prisma.chapter.count({ where: { bookId } }),
      this.prisma.chapter.findMany({
        where: { bookId },
        skip,
        take: limit,
        orderBy: { orderNum: 'asc' },
        select: {
          id: true,
          title: true,
          orderNum: true,
          wordCount: true,
          isVip: true,
          createdAt: true
        }
      })
    ]);

    return {
      code: 200,
      msg: 'success',
      items: chapters,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // 获取章节详情（含内容）
  async findOne(id: number) {
    const chapter = await this.prisma.chapter.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!chapter) {
      return {
        code: 404,
        msg: 'Chapter not found',
        data: null
      };
    }

    // 获取上一章和下一章
    const [prevChapter, nextChapter] = await Promise.all([
      this.prisma.chapter.findFirst({
        where: {
          bookId: chapter.bookId,
          orderNum: { lt: chapter.orderNum }
        },
        orderBy: { orderNum: 'desc' },
        select: { id: true, title: true }
      }),
      this.prisma.chapter.findFirst({
        where: {
          bookId: chapter.bookId,
          orderNum: { gt: chapter.orderNum }
        },
        orderBy: { orderNum: 'asc' },
        select: { id: true, title: true }
      })
    ]);

    return {
      code: 200,
      msg: 'success',
      data: {
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        orderNum: chapter.orderNum,
        wordCount: chapter.wordCount,
        isVip: chapter.isVip,
        book: chapter.book,
        prevChapter,
        nextChapter
      }
    };
  }
}
