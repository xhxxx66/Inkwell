import { BooksService } from './books.service';
import { BookQueryDto } from './dto/book-query.dto';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    getBooks(query: BookQueryDto): Promise<{
        code: number;
        msg: string;
        items: {
            id: number;
            title: string;
            author: string;
            cover: string | null;
            description: string | null;
            category: string;
            tags: string[];
            wordCount: number;
            chapterCount: number;
            status: string;
            rating: number;
            readCount: number;
            likeCount: number;
            collectCount: number;
            commentCount: number;
            publishedAt: Date | null;
        }[];
        pagination: {
            current: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    searchBooks(keyword: string): Promise<{
        code: number;
        msg: string;
        data: {
            id: number;
            title: string;
            author: string;
            cover: string | null;
            category: string;
            wordCount: number;
            status: string;
        }[];
    }>;
    getBook(id: number): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: {
            id: number;
            title: string;
            author: string;
            cover: string | null;
            description: string | null;
            category: string;
            tags: string[];
            wordCount: number;
            chapterCount: number;
            status: string;
            rating: number;
            readCount: number;
            likeCount: number;
            collectCount: number;
            commentCount: number;
            publishedAt: Date | null;
            authorUser: {
                id: number;
                nickname: string | null;
                avatar: string | null;
            } | null;
        };
    }>;
}
