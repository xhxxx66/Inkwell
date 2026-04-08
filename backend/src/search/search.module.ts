import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SemanticSearchService } from './semantic-search.service';
import { BooksModule } from '../books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [SearchController],
  providers: [SemanticSearchService],
  exports: [SemanticSearchService],
})
export class SearchModule {}
