import { ChapterQueryDto } from './dto/chapter-query.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ChaptersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByBookId(bookId: number, query: ChapterQueryDto): Promise<{
        code: number;
        msg: string;
        items: {
            id: number;
            orderNum: number;
            title: string;
            wordCount: number;
            createdAt: Date;
            isVip: boolean;
        }[];
        pagination: {
            current: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: number): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: {
            id: number;
            title: string;
            content: string;
            orderNum: number;
            wordCount: number;
            isVip: boolean;
            book: {
                id: number;
                title: string;
            };
            prevChapter: {
                id: number;
                title: string;
            } | null;
            nextChapter: {
                id: number;
                title: string;
            } | null;
        };
    }>;
}
