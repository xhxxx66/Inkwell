import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertReadingRecordDto } from './dto/upsert-reading-record.dto';

@Injectable()
export class ReadingRecordsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取用户的阅读历史列表
   */
  async findAllByUser(userId: number, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    const [records, total] = await Promise.all([
      this.prisma.readingRecord.findMany({
        where: { userId },
        orderBy: { lastReadAt: 'desc' },
        skip,
        take: pageSize,
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              cover: true,
              chapterCount: true,
              status: true,
            },
          },
          chapter: {
            select: {
              id: true,
              title: true,
              orderNum: true,
            },
          },
        },
      }),
      this.prisma.readingRecord.count({ where: { userId } }),
    ]);

    const items = records.map((record) => ({
      id: record.id,
      bookId: record.book.id,
      bookTitle: record.book.title,
      author: record.book.author,
      cover: record.book.cover,
      chapterCount: record.book.chapterCount,
      bookStatus: record.book.status,
      chapterId: record.chapter.id,
      chapterTitle: record.chapter.title,
      chapterOrderNum: record.chapter.orderNum,
      progress: record.progress,
      lastReadAt: record.lastReadAt,
    }));

    return {
      code: 200,
      msg: 'success',
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取用户对某本书的阅读记录
   */
  async findByUserAndBook(userId: number, bookId: number) {
    const record = await this.prisma.readingRecord.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            orderNum: true,
          },
        },
      },
    });

    if (!record) {
      return {
        code: 200,
        msg: 'success',
        data: null,
      };
    }

    return {
      code: 200,
      msg: 'success',
      data: {
        id: record.id,
        bookId: record.bookId,
        chapterId: record.chapter.id,
        chapterTitle: record.chapter.title,
        chapterOrderNum: record.chapter.orderNum,
        progress: record.progress,
        lastReadAt: record.lastReadAt,
      },
    };
  }

  /**
   * 更新或创建阅读记录
   */
  async upsert(userId: number, dto: UpsertReadingRecordDto) {
    // 验证书籍和章节是否存在
    const [book, chapter] = await Promise.all([
      this.prisma.book.findUnique({ where: { id: dto.bookId } }),
      this.prisma.chapter.findUnique({ where: { id: dto.chapterId } }),
    ]);

    if (!book) {
      return {
        code: 404,
        msg: '书籍不存在',
        data: null,
      };
    }

    if (!chapter) {
      return {
        code: 404,
        msg: '章节不存在',
        data: null,
      };
    }

    // 验证章节属于该书籍
    if (chapter.bookId !== dto.bookId) {
      return {
        code: 400,
        msg: '章节不属于该书籍',
        data: null,
      };
    }

    // 更新或创建阅读记录
    const record = await this.prisma.readingRecord.upsert({
      where: {
        userId_bookId: {
          userId,
          bookId: dto.bookId,
        },
      },
      update: {
        chapterId: dto.chapterId,
        progress: dto.progress,
        lastReadAt: new Date(),
      },
      create: {
        userId,
        bookId: dto.bookId,
        chapterId: dto.chapterId,
        progress: dto.progress,
      },
    });

    // 更新书籍阅读量（仅在创建新记录时增加）
    // 这里简单处理，每次更新记录都不增加阅读量
    // 实际业务中可能需要更复杂的逻辑

    return {
      code: 200,
      msg: 'success',
      data: {
        id: record.id,
        chapterId: record.chapterId,
        progress: record.progress,
        lastReadAt: record.lastReadAt,
      },
    };
  }

  /**
   * 删除阅读记录
   */
  async remove(userId: number, bookId: number) {
    const record = await this.prisma.readingRecord.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!record) {
      return {
        code: 404,
        msg: '阅读记录不存在',
        data: null,
      };
    }

    await this.prisma.readingRecord.delete({
      where: { id: record.id },
    });

    return {
      code: 200,
      msg: '删除成功',
      data: null,
    };
  }

  /**
   * 清空用户的所有阅读记录
   */
  async clearAll(userId: number) {
    await this.prisma.readingRecord.deleteMany({
      where: { userId },
    });

    return {
      code: 200,
      msg: '已清空阅读历史',
      data: null,
    };
  }

  /**
   * 批量获取用户书架中书籍的阅读记录
   * 用于书架页面显示阅读进度
   */
  async findByUserAndBooks(userId: number, bookIds: number[]) {
    const records = await this.prisma.readingRecord.findMany({
      where: {
        userId,
        bookId: { in: bookIds },
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            orderNum: true,
          },
        },
      },
    });

    const recordMap = records.reduce(
      (acc, record) => {
        acc[record.bookId] = {
          chapterId: record.chapter.id,
          chapterTitle: record.chapter.title,
          chapterOrderNum: record.chapter.orderNum,
          progress: record.progress,
          lastReadAt: record.lastReadAt,
        };
        return acc;
      },
      {} as Record<number, any>,
    );

    return {
      code: 200,
      msg: 'success',
      data: recordMap,
    };
  }
}
