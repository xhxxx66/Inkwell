import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
export declare class BookmarksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: number): Promise<{
        code: number;
        msg: string;
        data: {
            id: number;
            bookId: number;
            title: string;
            author: string;
            cover: string | null;
            category: string;
            wordCount: number;
            chapterCount: number;
            status: string;
            addedAt: Date;
        }[];
    }>;
    add(userId: number, dto: CreateBookmarkDto): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: {
            id: number;
        };
    }>;
    remove(userId: number, bookId: number): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    checkBookmark(userId: number, bookId: number): Promise<{
        code: number;
        msg: string;
        data: {
            isBookmarked: boolean;
        };
    }>;
    toggle(userId: number, bookId: number): Promise<{
        code: number;
        msg: string;
        data: {
            isBookmarked: boolean;
        };
    } | {
        code: number;
        msg: string;
        data: null;
    }>;
}
