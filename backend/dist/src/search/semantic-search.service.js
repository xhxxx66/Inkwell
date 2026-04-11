"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemanticSearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const openai_1 = require("@langchain/openai");
function cosineSimilarity(a, b) {
    if (a.length !== b.length)
        return 0;
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    const denominator = normA * normB;
    return denominator === 0 ? 0 : dotProduct / denominator;
}
const DASHSCOPE_OPENAI_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
let SemanticSearchService = class SemanticSearchService {
    configService;
    vectorData = null;
    vectorFilePath;
    embeddings;
    constructor(configService) {
        this.configService = configService;
        this.vectorFilePath = path.join(process.cwd(), 'data', 'book-vectors.json');
        this.embeddings = new openai_1.OpenAIEmbeddings({
            configuration: {
                apiKey: this.configService.get('DASHSCOPE_API_KEY') || '',
                baseURL: this.configService.get('DASHSCOPE_OPENAI_BASE_URL') ||
                    DASHSCOPE_OPENAI_BASE_URL,
            },
            model: 'text-embedding-v3',
            dimensions: 1024,
        });
    }
    async onModuleInit() {
        await this.loadVectorData();
    }
    async loadVectorData() {
        try {
            if (fs.existsSync(this.vectorFilePath)) {
                const data = fs.readFileSync(this.vectorFilePath, 'utf-8');
                this.vectorData = JSON.parse(data);
            }
            else {
                this.vectorData = { books: [], updatedAt: '' };
            }
        }
        catch {
            this.vectorData = { books: [], updatedAt: '' };
        }
    }
    async reloadVectorData() {
        await this.loadVectorData();
        return { success: true, count: this.vectorData?.books.length || 0 };
    }
    async semanticSearch(query, limit = 10) {
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
            delete book.embedding;
            return {
                ...book,
                score: Math.round(similarity * 100) / 100,
            };
        });
        return results;
    }
};
exports.SemanticSearchService = SemanticSearchService;
exports.SemanticSearchService = SemanticSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SemanticSearchService);
//# sourceMappingURL=semantic-search.service.js.map