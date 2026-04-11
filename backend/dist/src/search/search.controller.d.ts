import { SemanticSearchService } from './semantic-search.service';
import { BooksService } from '../books/books.service';
export declare class SearchController {
    private readonly semanticSearchService;
    private readonly booksService;
    constructor(semanticSearchService: SemanticSearchService, booksService: BooksService);
    search(keyword: string, limit?: string, mode?: string): Promise<{
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
    } | {
        code: number;
        msg: string;
        data: {
            score: number;
            id: number;
            title: string;
            author: string;
            cover: string;
            category: string;
            wordCount: number;
            status: string;
            description: string;
            embedding: number[];
        }[];
        mode: string;
    }>;
    reloadVectors(): Promise<{
        code: number;
        msg: string;
        data: {
            success: boolean;
            count: number;
        };
    }>;
}
