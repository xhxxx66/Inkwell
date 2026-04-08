import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { OpenAIEmbeddings } from '@langchain/openai';

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
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

const DASHSCOPE_OPENAI_BASE_URL =
  'https://dashscope.aliyuncs.com/compatible-mode/v1';

const prisma = new PrismaClient();
const embeddings = new OpenAIEmbeddings({
  configuration: {
    apiKey: envVars.DASHSCOPE_API_KEY,
    baseURL: envVars.DASHSCOPE_OPENAI_BASE_URL || DASHSCOPE_OPENAI_BASE_URL,
  },
  model: 'text-embedding-v3',
  dimensions: 1024,
});

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

  const bookVectors: BookVector[] = [];

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
    } catch {
      // 跳过失败的书籍，继续处理下一本
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
