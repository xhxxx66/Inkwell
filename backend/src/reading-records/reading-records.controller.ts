import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReadingRecordsService } from './reading-records.service';
import { UpsertReadingRecordDto } from './dto/upsert-reading-record.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('reading-records')
@UseGuards(JwtAuthGuard)
export class ReadingRecordsController {
  constructor(private readonly readingRecordsService: ReadingRecordsService) {}

  /**
   * 获取阅读历史列表
   * GET /api/reading-records
   */
  @Get()
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const userId = parseInt(req.user.id);
    return this.readingRecordsService.findAllByUser(
      userId,
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 20,
    );
  }

  /**
   * 获取某本书的阅读记录
   * GET /api/reading-records/book/:bookId
   */
  @Get('book/:bookId')
  async findByBook(
    @Request() req,
    @Param('bookId', ParseIntPipe) bookId: number,
  ) {
    const userId = parseInt(req.user.id);
    return this.readingRecordsService.findByUserAndBook(userId, bookId);
  }

  /**
   * 批量获取多本书的阅读记录
   * POST /api/reading-records/batch
   */
  @Post('batch')
  async findByBooks(@Request() req, @Body('bookIds') bookIds: number[]) {
    const userId = parseInt(req.user.id);
    return this.readingRecordsService.findByUserAndBooks(userId, bookIds);
  }

  /**
   * 更新/创建阅读记录
   * POST /api/reading-records
   */
  @Post()
  async upsert(@Request() req, @Body() dto: UpsertReadingRecordDto) {
    const userId = parseInt(req.user.id);
    return this.readingRecordsService.upsert(userId, dto);
  }

  /**
   * 删除某本书的阅读记录
   * DELETE /api/reading-records/book/:bookId
   */
  @Delete('book/:bookId')
  async remove(@Request() req, @Param('bookId', ParseIntPipe) bookId: number) {
    const userId = parseInt(req.user.id);
    return this.readingRecordsService.remove(userId, bookId);
  }

  /**
   * 清空所有阅读记录
   * DELETE /api/reading-records/clear
   */
  @Delete('clear')
  async clearAll(@Request() req) {
    const userId = parseInt(req.user.id);
    return this.readingRecordsService.clearAll(userId);
  }
}
