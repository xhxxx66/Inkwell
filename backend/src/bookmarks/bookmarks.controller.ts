import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  /**
   * 获取当前用户的书架列表
   * GET /api/bookmarks
   */
  @Get()
  async findAll(@Request() req) {
    const userId = parseInt(req.user.id);
    return this.bookmarksService.findAllByUser(userId);
  }

  /**
   * 加入书架
   * POST /api/bookmarks
   */
  @Post()
  async add(@Request() req, @Body() dto: CreateBookmarkDto) {
    const userId = parseInt(req.user.id);
    return this.bookmarksService.add(userId, dto);
  }

  /**
   * 移出书架
   * DELETE /api/bookmarks/:bookId
   */
  @Delete(':bookId')
  async remove(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
    const userId = parseInt(req.user.id);
    return this.bookmarksService.remove(userId, bookId);
  }

  /**
   * 检查书籍是否在书架中
   * GET /api/bookmarks/check/:bookId
   */
  @Get('check/:bookId')
  async check(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
    const userId = parseInt(req.user.id);
    return this.bookmarksService.checkBookmark(userId, bookId);
  }

  /**
   * 切换书架状态
   * POST /api/bookmarks/toggle/:bookId
   */
  @Post('toggle/:bookId')
  async toggle(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
    const userId = parseInt(req.user.id);
    return this.bookmarksService.toggle(userId, bookId);
  }
}
