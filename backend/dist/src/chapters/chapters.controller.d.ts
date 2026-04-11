import { ChaptersService } from './chapters.service';
import { ChapterQueryDto } from './dto/chapter-query.dto';
export declare class ChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    getChaptersByBook(bookId: number, query: ChapterQueryDto): Promise<{
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
    getChapter(id: number): Promise<{
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
