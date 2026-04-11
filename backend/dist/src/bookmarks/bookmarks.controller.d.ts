import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    findAll(req: any): Promise<{
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
    add(req: any, dto: CreateBookmarkDto): Promise<{
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
    remove(req: any, bookId: number): Promise<{
        code: number;
        msg: string;
        data: null;
    }>;
    check(req: any, bookId: number): Promise<{
        code: number;
        msg: string;
        data: {
            isBookmarked: boolean;
        };
    }>;
    toggle(req: any, bookId: number): Promise<{
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
