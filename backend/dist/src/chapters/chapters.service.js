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
exports.ChaptersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChaptersService = class ChaptersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByBookId(bookId, query) {
        const { page = 1, limit = 50 } = query;
        const skip = (page - 1) * limit;
        const [total, chapters] = await Promise.all([
            this.prisma.chapter.count({ where: { bookId } }),
            this.prisma.chapter.findMany({
                where: { bookId },
                skip,
                take: limit,
                orderBy: { orderNum: 'asc' },
                select: {
                    id: true,
                    title: true,
                    orderNum: true,
                    wordCount: true,
                    isVip: true,
                    createdAt: true,
                },
            }),
        ]);
        return {
            code: 200,
            msg: 'success',
            items: chapters,
            pagination: {
                current: page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const chapter = await this.prisma.chapter.findUnique({
            where: { id },
            include: {
                book: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        if (!chapter) {
            return {
                code: 404,
                msg: 'Chapter not found',
                data: null,
            };
        }
        const [prevChapter, nextChapter] = await Promise.all([
            this.prisma.chapter.findFirst({
                where: {
                    bookId: chapter.bookId,
                    orderNum: { lt: chapter.orderNum },
                },
                orderBy: { orderNum: 'desc' },
                select: { id: true, title: true },
            }),
            this.prisma.chapter.findFirst({
                where: {
                    bookId: chapter.bookId,
                    orderNum: { gt: chapter.orderNum },
                },
                orderBy: { orderNum: 'asc' },
                select: { id: true, title: true },
            }),
        ]);
        return {
            code: 200,
            msg: 'success',
            data: {
                id: chapter.id,
                title: chapter.title,
                content: chapter.content,
                orderNum: chapter.orderNum,
                wordCount: chapter.wordCount,
                isVip: chapter.isVip,
                book: chapter.book,
                prevChapter,
                nextChapter,
            },
        };
    }
};
exports.ChaptersService = ChaptersService;
exports.ChaptersService = ChaptersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChaptersService);
//# sourceMappingURL=chapters.service.js.map