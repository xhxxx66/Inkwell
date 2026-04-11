"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BooksService = class BooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, category } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (category && category !== '全部') {
            where.category = {
                name: category,
            };
        }
        const [total, books] = await Promise.all([
            this.prisma.book.count({ where }),
            this.prisma.book.findMany({
                skip,
                take: limit,
                where,
                orderBy: { id: 'desc' },
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
            }),
        ]);
        const items = books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            description: book.description,
            category: book.category?.name || '',
            tags: book.tags.map((t) => t.tag.name),
            wordCount: book.wordCount,
            chapterCount: book.chapterCount,
            status: book.status,
            rating: Number(book.rating),
            readCount: book.readCount,
            likeCount: book.likeCount,
            collectCount: book.collectCount,
            commentCount: book.commentCount,
            publishedAt: book.publishedAt,
        }));
        return {
            code: 200,
            msg: 'success',
            items,
            pagination: {
                current: page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async search(keyword, limit = 10) {
        if (!keyword || !keyword.trim()) {
            return {
                code: 200,
                msg: 'success',
                data: [],
            };
        }
        const books = await this.prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: keyword, mode: 'insensitive' } },
                    { author: { contains: keyword, mode: 'insensitive' } },
                ],
            },
            take: limit,
            orderBy: { readCount: 'desc' },
            include: {
                category: {
                    select: { name: true },
                },
            },
        });
        const items = books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            category: book.category?.name || '',
            wordCount: book.wordCount,
            status: book.status,
        }));
        return {
            code: 200,
            msg: 'success',
            data: items,
        };
    }
    async findOne(id) {
        const book = await this.prisma.book.findUnique({
            where: { id },
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
                authorUser: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                    },
                },
            },
        });
        if (!book) {
            return {
                code: 404,
                msg: 'Book not found',
                data: null,
            };
        }
        return {
            code: 200,
            msg: 'success',
            data: {
                id: book.id,
                title: book.title,
                author: book.author,
                cover: book.cover,
                description: book.description,
                category: book.category?.name || '',
                tags: book.tags.map((t) => t.tag.name),
                wordCount: book.wordCount,
                chapterCount: book.chapterCount,
                status: book.status,
                rating: Number(book.rating),
                readCount: book.readCount,
                likeCount: book.likeCount,
                collectCount: book.collectCount,
                commentCount: book.commentCount,
                publishedAt: book.publishedAt,
                authorUser: book.authorUser,
            },
        };
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BooksService);
//# sourceMappingURL=books.service.js.map