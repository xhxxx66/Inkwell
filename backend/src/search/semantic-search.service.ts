import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { OpenAIEmbeddings } from '@langchain/openai';

interface BookVector {
  id: number;
  title: string;
  author: string;
  cover: string;
  category: string;
  wordCount: number;
  status: string;
  description: string;
  embedding: number[];
}

interface VectorData {
  books: BookVector[];
  updatedAt: string;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  const denominator = normA * normB;
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/** 阿里云 DashScope OpenAI 兼容模式 baseURL */
const DASHSCOPE_OPENAI_BASE_URL =
  'https://dashscope.aliyuncs.com/compatible-mode/v1';

@Injectable()
export class SemanticSearchService implements OnModuleInit {
  private vectorData: VectorData | null = null;
  private readonly vectorFilePath: string;
  private readonly embeddings: OpenAIEmbeddings;

  constructor(private configService: ConfigService) {
    this.vectorFilePath = path.join(process.cwd(), 'data', 'book-vectors.json');
    this.embeddings = new OpenAIEmbeddings({
      configuration: {
        apiKey: this.configService.get('DASHSCOPE_API_KEY') || '',
        baseURL:
          this.configService.get('DASHSCOPE_OPENAI_BASE_URL') ||
          DASHSCOPE_OPENAI_BASE_URL,
      },
      model: 'text-embedding-v3',
      dimensions: 1024,
    });
  }

  async onModuleInit() {
    await this.loadVectorData();
  }

  private async loadVectorData() {
    try {
      if (fs.existsSync(this.vectorFilePath)) {
        const data = fs.readFileSync(this.vectorFilePath, 'utf-8');
        this.vectorData = JSON.parse(data);
      } else {
        this.vectorData = { books: [], updatedAt: '' };
      }
    } catch {
      this.vectorData = { books: [], updatedAt: '' };
    }
  }

  async reloadVectorData() {
    await this.loadVectorData();
    return { success: true, count: this.vectorData?.books.length || 0 };
  }

  async semanticSearch(query: string, limit: number = 10) {
    if (!this.vectorData || this.vectorData.books.length === 0) {
      return [];
    }

    const queryEmbedding = await this.embeddings.embedQuery(query);

    const results = this.vectorData.books
      .map((book) => ({
        ...book,
        similarity: cosineSimilarity(queryEmbedding, book.embedding),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .filter((book) => book.similarity > 0.3)
      .map((item) => {
        const { similarity, ...book } = item;
        delete (book as any).embedding;
        return {
          ...book,
          score: Math.round(similarity * 100) / 100,
        };
      });

    return results;
  }
}
