import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { ChapterQueryDto } from './dto/chapter-query.dto';

@Controller()
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  // GET /api/books/:bookId/chapters - 获取书籍章节列表
  @Get('books/:bookId/chapters')
  async getChaptersByBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Query() query: ChapterQueryDto
  ) {
    return this.chaptersService.findByBookId(bookId, query);
  }

  // GET /api/chapters/:id - 获取章节详情
  @Get('chapters/:id')
  async getChapter(@Param('id', ParseIntPipe) id: number) {
    return this.chaptersService.findOne(id);
  }
}
