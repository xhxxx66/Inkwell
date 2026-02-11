import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import { BooksService } from './books.service';
import { BookQueryDto } from './dto/book-query.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  async getBooks(@Query() query: BookQueryDto) {
    return this.booksService.findAll(query);
  }

  @Get(':id')
  async getBook(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }
}
