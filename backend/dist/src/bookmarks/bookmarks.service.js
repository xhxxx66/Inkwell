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
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookmarksService = class BookmarksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAllByUser(userId) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                book: {
                    include: {
                        category: {
                            select: { name: true },
                        },
                    },
                },
            },
        });
        const items = bookmarks.map((bookmark) => ({
            id: bookmark.id,
            bookId: bookmark.book.id,
            title: bookmark.book.title,
            author: bookmark.book.author,
            cover: bookmark.book.cover,
            category: bookmark.book.category?.name || '',
            wordCount: bookmark.book.wordCount,
            chapterCount: bookmark.book.chapterCount,
            status: bookmark.book.status,
            addedAt: bookmark.createdAt,
        }));
        return {
            code: 200,
            msg: 'success',
            data: items,
        };
    }
    async add(userId, dto) {
        const book = await this.prisma.book.findUnique({
            where: { id: dto.bookId },
        });
        if (!book) {
            return {
                code: 404,
                msg: '书籍不存在',
                data: null,
            };
        }
        const existing = await this.prisma.bookmark.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId: dto.bookId,
                },
            },
        });
        if (existing) {
            return {
                code: 400,
                msg: '该书籍已在书架中',
                data: null,
            };
        }
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                bookId: dto.bookId,
            },
        });
        await this.prisma.book.update({
            where: { id: dto.bookId },
            data: { collectCount: { increment: 1 } },
        });
        return {
            code: 200,
            msg: '加入书架成功',
            data: { id: bookmark.id },
        };
    }
    async remove(userId, bookId) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
        });
        if (!bookmark) {
            return {
                code: 404,
                msg: '该书籍不在书架中',
                data: null,
            };
        }
        await this.prisma.bookmark.delete({
            where: { id: bookmark.id },
        });
        await this.prisma.book.update({
            where: { id: bookId },
            data: { collectCount: { decrement: 1 } },
        });
        return {
            code: 200,
            msg: '移出书架成功',
            data: null,
        };
    }
    async checkBookmark(userId, bookId) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
        });
        return {
            code: 200,
            msg: 'success',
            data: {
                isBookmarked: !!bookmark,
            },
        };
    }
    async toggle(userId, bookId) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                userId_bookId: {
                    userId,
                    bookId,
                },
            },
        });
        if (bookmark) {
            await this.prisma.bookmark.delete({
                where: { id: bookmark.id },
            });
            await this.prisma.book.update({
                where: { id: bookId },
                data: { collectCount: { decrement: 1 } },
            });
            return {
                code: 200,
                msg: '已移出书架',
                data: { isBookmarked: false },
            };
        }
        else {
            const book = await this.prisma.book.findUnique({
                where: { id: bookId },
            });
            if (!book) {
                return {
                    code: 404,
                    msg: '书籍不存在',
                    data: null,
                };
            }
            await this.prisma.bookmark.create({
                data: {
                    userId,
                    bookId,
                },
            });
            await this.prisma.book.update({
                where: { id: bookId },
                data: { collectCount: { increment: 1 } },
            });
            return {
                code: 200,
                msg: '已加入书架',
                data: { isBookmarked: true },
            };
        }
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map