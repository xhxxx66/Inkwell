import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { CategoriesModule } from './categories/categories.module';
import { ChaptersModule } from './chapters/chapters.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ReadingRecordsModule } from './reading-records/reading-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    BooksModule,
    CategoriesModule,
    ChaptersModule,
    AuthModule,
    UsersModule,
    BookmarksModule,
    ReadingRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
