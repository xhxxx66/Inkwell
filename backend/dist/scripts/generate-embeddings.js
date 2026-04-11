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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const openai_1 = require("@langchain/openai");
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
            let value = valueParts.join('=');
            value = value.replace(/^["']|["']$/g, '');
            envVars[key] = value;
        }
    }
});
const DASHSCOPE_OPENAI_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
const prisma = new client_1.PrismaClient();
const embeddings = new openai_1.OpenAIEmbeddings({
    configuration: {
        apiKey: envVars.DASHSCOPE_API_KEY,
        baseURL: envVars.DASHSCOPE_OPENAI_BASE_URL || DASHSCOPE_OPENAI_BASE_URL,
    },
    model: 'text-embedding-v3',
    dimensions: 1024,
});
async function generateEmbeddings() {
    const books = await prisma.book.findMany({
        include: {
            category: {
                select: { name: true },
            },
            tags: {
                select: {
                    tag: {
                        select: { name: true },
                    },
                },
            },
        },
    });
    const bookVectors = [];
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const tags = book.tags.map(t => t.tag.name).join(', ');
        const textToEmbed = `标题: ${book.title} 作者: ${book.author} 分类: ${book.category?.name || ''} 标签: ${tags} 简介: ${book.description || ''}`.trim();
        try {
            const embedding = await embeddings.embedQuery(textToEmbed);
            bookVectors.push({
                id: book.id,
                title: book.title,
                author: book.author,
                cover: book.cover || '',
                category: book.category?.name || '',
                wordCount: book.wordCount,
                status: book.status,
                description: book.description || '',
                embedding,
            });
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        catch {
        }
    }
    const outputPath = path.join(process.cwd(), 'data', 'book-vectors.json');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const vectorData = {
        books: bookVectors,
        updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(outputPath, JSON.stringify(vectorData, null, 2));
    await prisma.$disconnect();
}
generateEmbeddings().catch(() => process.exit(1));
//# sourceMappingURL=generate-embeddings.js.map