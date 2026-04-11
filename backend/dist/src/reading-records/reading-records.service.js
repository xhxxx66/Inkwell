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
exports.ReadingRecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReadingRecordsService = class ReadingRecordsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllByUser(userId, page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [records, total] = await Promise.all([
            this.prisma.readingRecord.findMany({
                where: { userId },
                orderBy: { lastReadAt: 'desc' },
                skip,
                take: pageSize,
                include: {
                    book: {
                        select: {
                            id: true,
                            title: true,
                            author: true,
                            cover: true,
                            chapterCount: true,
                            status: true,
                        },
                    },
                    chapter: {
                        select: {
                            id: true,
                            title: true,
                            orderNum: true,
                        },
                    },
                },
            }),
            this.prisma.readingRecord.count({ where: { userId } }),
        ]);
        const items = records.map((record) => ({
            id: record.id,
            bookId: record.book.id,
            bookTitle: record.book.title,
            author: record.book.author,
            cover: record.book.cover,
            chapterCount: record.book.chapterCount,
            bookStatus: record.book.status,
            chapterId: record.chapter.id,
            chapterTitle: record.chapter.title,
            chapterOrderNum: record.chapter.orderNum,
            progress: record.progress,
            lastReadAt: record.lastReadAt,
        }));
        return {
            code: 200,
            msg: 'success',
            data: {
                items,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    }
    async findByUserAndBook(userId, bookId) {
        const record = await this.prisma.readingRecord.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
            include: {
                chapter: {
                    select: {
                        id: true,
                        title: true,
                        orderNum: true,
                    },
                },
            },
        });
        if (!record) {
            return {
                code: 200,
                msg: 'success',
                data: null,
            };
        }
        return {
            code: 200,
            msg: 'success',
            data: {
                id: record.id,
                bookId: record.bookId,
                chapterId: record.chapter.id,
                chapterTitle: record.chapter.title,
                chapterOrderNum: record.chapter.orderNum,
                progress: record.progress,
                lastReadAt: record.lastReadAt,
            },
        };
    }
    async upsert(userId, dto) {
        const [book, chapter] = await Promise.all([
            this.prisma.book.findUnique({ where: { id: dto.bookId } }),
            this.prisma.chapter.findUnique({ where: { id: dto.chapterId } }),
        ]);
        if (!book) {
            return {
                code: 404,
                msg: '书籍不存在',
                data: null,
            };
        }
        if (!chapter) {
            return {
                code: 404,
                msg: '章节不存在',
                data: null,
            };
        }
        if (chapter.bookId !== dto.bookId) {
            return {
                code: 400,
                msg: '章节不属于该书籍',
                data: null,
            };
        }
        const record = await this.prisma.readingRecord.upsert({
            where: {
                userId_bookId: {
                    userId,
                    bookId: dto.bookId,
                },
            },
            update: {
                chapterId: dto.chapterId,
                progress: dto.progress,
                lastReadAt: new Date(),
            },
            create: {
                userId,
                bookId: dto.bookId,
                chapterId: dto.chapterId,
                progress: dto.progress,
            },
        });
        return {
            code: 200,
            msg: 'success',
            data: {
                id: record.id,
                chapterId: record.chapterId,
                progress: record.progress,
                lastReadAt: record.lastReadAt,
            },
        };
    }
    async remove(userId, bookId) {
        const record = await this.prisma.readingRecord.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
        });
        if (!record) {
            return {
                code: 404,
                msg: '阅读记录不存在',
                data: null,
            };
        }
        await this.prisma.readingRecord.delete({
            where: { id: record.id },
        });
        return {
            code: 200,
            msg: '删除成功',
            data: null,
        };
    }
    async clearAll(userId) {
        await this.prisma.readingRecord.deleteMany({
            where: { userId },
        });
        return {
            code: 200,
            msg: '已清空阅读历史',
            data: null,
        };
    }
    async findByUserAndBooks(userId, bookIds) {
        const records = await this.prisma.readingRecord.findMany({
            where: {
                userId,
                bookId: { in: bookIds },
            },
            include: {
                chapter: {
                    select: {
                        id: true,
                        title: true,
                        orderNum: true,
                    },
                },
            },
        });
        const recordMap = records.reduce((acc, record) => {
            acc[record.bookId] = {
                chapterId: record.chapter.id,
                chapterTitle: record.chapter.title,
                chapterOrderNum: record.chapter.orderNum,
                progress: record.progress,
                lastReadAt: record.lastReadAt,
            };
            return acc;
        }, {});
        return {
            code: 200,
            msg: 'success',
            data: recordMap,
        };
    }
};
exports.ReadingRecordsService = ReadingRecordsService;
exports.ReadingRecordsService = ReadingRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReadingRecordsService);
//# sourceMappingURL=reading-records.service.js.map