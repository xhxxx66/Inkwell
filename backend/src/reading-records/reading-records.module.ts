import { Module } from '@nestjs/common';
import { ReadingRecordsController } from './reading-records.controller';
import { ReadingRecordsService } from './reading-records.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReadingRecordsController],
  providers: [ReadingRecordsService],
  exports: [ReadingRecordsService],
})
export class ReadingRecordsModule {}
