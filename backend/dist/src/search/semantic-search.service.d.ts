import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class SemanticSearchService implements OnModuleInit {
    private configService;
    private vectorData;
    private readonly vectorFilePath;
    private readonly embeddings;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private loadVectorData;
    reloadVectorData(): Promise<{
        success: boolean;
        count: number;
    }>;
    semanticSearch(query: string, limit?: number): Promise<{
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
    }[]>;
}
