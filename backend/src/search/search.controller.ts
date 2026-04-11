import { Controller, Get, Query, Post } from '@nestjs/common';
import { SemanticSearchService } from './semantic-search.service';
import { BooksService } from '../books/books.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly semanticSearchService: SemanticSearchService,
    private readonly booksService: BooksService,
  ) {}

  @Get()
  async search(
    @Query('keyword') keyword: string,
    @Query('limit') limit: string = '10',
    @Query('mode') mode: string = 'semantic',
  ) {
    const decodedKeyword = decodeURIComponent(keyword || '');
    const parsedLimit = parseInt(limit, 10) || 10;

    if (!decodedKeyword.trim()) {
      return {
        code: 200,
        msg: 'success',
        data: [],
      };
    }

    try {
      if (mode === 'semantic') {
        const results = await this.semanticSearchService.semanticSearch(
          decodedKeyword,
          parsedLimit,
        );

        if (results.length === 0) {
          const fallback = await this.booksService.search(
            decodedKeyword,
            parsedLimit,
          );
          return fallback;
        }

        return {
          code: 200,
          msg: 'success',
          data: results,
          mode: 'semantic',
        };
      } else {
        return await this.booksService.search(decodedKeyword, parsedLimit);
      }
    } catch {
      return await this.booksService.search(decodedKeyword, parsedLimit);
    }
  }

  @Post('reload-vectors')
  async reloadVectors() {
    const result = await this.semanticSearchService.reloadVectorData();
    return {
      code: 200,
      msg: 'Vectors reloaded',
      data: result,
    };
  }
}
