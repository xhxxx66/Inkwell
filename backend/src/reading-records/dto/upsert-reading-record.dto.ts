import { IsInt, IsPositive, Min, Max } from 'class-validator';

export class UpsertReadingRecordDto {
  @IsInt()
  @IsPositive()
  bookId: number;

  @IsInt()
  @IsPositive()
  chapterId: number;

  @IsInt()
  @Min(0)
  @Max(100)
  progress: number; // 章节内阅读进度百分比 0-100
}
