import { Injectable } from '@nestjs/common';
import { BookQueryDto } from './dto/book-query.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: BookQueryDto) {
    const { page = 1, limit = 10, category } = query;
    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    if (category && category !== '全部') {
      where.category = {
        name: category
      };
    }

    const [total, books] = await Promise.all([
      this.prisma.book.count({ where }),
      this.prisma.book.findMany({
        skip,
        take: limit,
        where,
        orderBy: { id: 'desc' },
        include: {
          category: {
            select: { name: true }
          },
          tags: {
            select: {
              tag: {
                select: { name: true }
              }
            }
          }
        }
      })
    ]);

    // 整理返回数据
    const items = books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      description: book.description,
      category: book.category?.name || '',
      tags: book.tags.map(t => t.tag.name),
      wordCount: book.wordCount,
      chapterCount: book.chapterCount,
      status: book.status,
      rating: Number(book.rating),
      readCount: book.readCount,
      likeCount: book.likeCount,
      collectCount: book.collectCount,
      commentCount: book.commentCount,
      publishedAt: book.publishedAt
    }));

    return {
      code: 200,
      msg: 'success',
      items,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        category: {
          select: { name: true }
        },
        tags: {
          select: {
            tag: {
              select: { name: true }
            }
          }
        },
        authorUser: {
          select: {
            id: true,
            nickname: true,
            avatar: true
          }
        }
      }
    });

    if (!book) {
      return {
        code: 404,
        msg: 'Book not found',
        data: null
      };
    }

    return {
      code: 200,
      msg: 'success',
      data: {
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        description: book.description,
        category: book.category?.name || '',
        tags: book.tags.map(t => t.tag.name),
        wordCount: book.wordCount,
        chapterCount: book.chapterCount,
        status: book.status,
        rating: Number(book.rating),
        readCount: book.readCount,
        likeCount: book.likeCount,
        collectCount: book.collectCount,
        commentCount: book.commentCount,
        publishedAt: book.publishedAt,
        authorUser: book.authorUser
      }
    };
  }
}
