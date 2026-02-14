import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Injectable()
export class BookmarksService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取用户书架列表
   */
  async findAllByUser(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        book: {
          include: {
            category: {
              select: { name: true },
            },
          },
        },
      },
    });

    const items = bookmarks.map((bookmark) => ({
      id: bookmark.id,
      bookId: bookmark.book.id,
      title: bookmark.book.title,
      author: bookmark.book.author,
      cover: bookmark.book.cover,
      category: bookmark.book.category?.name || '',
      wordCount: bookmark.book.wordCount,
      chapterCount: bookmark.book.chapterCount,
      status: bookmark.book.status,
      addedAt: bookmark.createdAt,
    }));

    return {
      code: 200,
      msg: 'success',
      data: items,
    };
  }

  /**
   * 加入书架
   */
  async add(userId: number, dto: CreateBookmarkDto) {
    // 检查书籍是否存在
    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
    });

    if (!book) {
      return {
        code: 404,
        msg: '书籍不存在',
        data: null,
      };
    }

    // 检查是否已加入书架
    const existing = await this.prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: dto.bookId,
        },
      },
    });

    if (existing) {
      return {
        code: 400,
        msg: '该书籍已在书架中',
        data: null,
      };
    }

    // 添加到书架
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        bookId: dto.bookId,
      },
    });

    // 更新书籍收藏数
    await this.prisma.book.update({
      where: { id: dto.bookId },
      data: { collectCount: { increment: 1 } },
    });

    return {
      code: 200,
      msg: '加入书架成功',
      data: { id: bookmark.id },
    };
  }

  /**
   * 移出书架
   */
  async remove(userId: number, bookId: number) {
    // 检查是否在书架中
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (!bookmark) {
      return {
        code: 404,
        msg: '该书籍不在书架中',
        data: null,
      };
    }

    // 从书架移除
    await this.prisma.bookmark.delete({
      where: { id: bookmark.id },
    });

    // 更新书籍收藏数
    await this.prisma.book.update({
      where: { id: bookId },
      data: { collectCount: { decrement: 1 } },
    });

    return {
      code: 200,
      msg: '移出书架成功',
      data: null,
    };
  }

  /**
   * 检查书籍是否在用户书架中
   */
  async checkBookmark(userId: number, bookId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    return {
      code: 200,
      msg: 'success',
      data: {
        isBookmarked: !!bookmark,
      },
    };
  }

  /**
   * 切换书架状态（加入/移出）
   */
  async toggle(userId: number, bookId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (bookmark) {
      // 已存在，移出
      await this.prisma.bookmark.delete({
        where: { id: bookmark.id },
      });

      await this.prisma.book.update({
        where: { id: bookId },
        data: { collectCount: { decrement: 1 } },
      });

      return {
        code: 200,
        msg: '已移出书架',
        data: { isBookmarked: false },
      };
    } else {
      // 不存在，加入
      const book = await this.prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        return {
          code: 404,
          msg: '书籍不存在',
          data: null,
        };
      }

      await this.prisma.bookmark.create({
        data: {
          userId,
          bookId,
        },
      });

      await this.prisma.book.update({
        where: { id: bookId },
        data: { collectCount: { increment: 1 } },
      });

      return {
        code: 200,
        msg: '已加入书架',
        data: { isBookmarked: true },
      };
    }
  }
}
