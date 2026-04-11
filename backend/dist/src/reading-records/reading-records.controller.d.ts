import { ReadingRecordsService } from './reading-records.service';
import { UpsertReadingRecordDto } from './dto/upsert-reading-record.dto';
export declare class ReadingRecordsController {
    private readonly readingRecordsService;
    constructor(readingRecordsService: ReadingRecordsService);
    findAll(req: any, page?: string, pageSize?: string): Promise<{
        code: number;
        msg: string;
        data: {
            items: {
                id: number;
                bookId: number;
                bookTitle: string;
                author: string;
                cover: string | null;
                chapterCount: number;
                bookStatus: string;
                chapterId: number;
                chapterTitle: string;
                chapterOrderNum: number;
                progress: number;
                lastReadAt: Date;
            }[];
            total: number;
            page: number;
            pageSize: number;
            totalPages: number;
        };
    }>;
    findByBook(req: any, bookId: number): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: {
            id: number;
            bookId: number;
            chapterId: number;
            chapterTitle: string;
            chapterOrderNum: number;
            progress: number;
            lastReadAt: Date;
        };
    }>;
    findByBooks(req: any, bookIds: number[]): Promise<{
        code: number;
        msg: string;
        data: Record<number, any>;
    }>;
    upsert(req: any, dto: UpsertReadingRecordDto): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: {
            id: number;
            chapterId: number;
            progress: number;
            lastReadAt: Date;
        };
    }>;
    remove(req: any, bookId: number): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    clearAll(req: any): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
}
