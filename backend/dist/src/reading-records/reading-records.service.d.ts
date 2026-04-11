import { PrismaService } from '../prisma/prisma.service';
import { UpsertReadingRecordDto } from './dto/upsert-reading-record.dto';
export declare class ReadingRecordsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: number, page?: number, pageSize?: number): Promise<{
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
    findByUserAndBook(userId: number, bookId: number): Promise<{
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
    upsert(userId: number, dto: UpsertReadingRecordDto): Promise<{
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
    remove(userId: number, bookId: number): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    clearAll(userId: number): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    findByUserAndBooks(userId: number, bookIds: number[]): Promise<{
        code: number;
        msg: string;
        data: Record<number, any>;
    }>;
}
