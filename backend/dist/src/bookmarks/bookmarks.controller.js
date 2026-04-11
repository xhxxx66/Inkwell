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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarksController = void 0;
const common_1 = require("@nestjs/common");
const bookmarks_service_1 = require("./bookmarks.service");
const create_bookmark_dto_1 = require("./dto/create-bookmark.dto");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
let BookmarksController = class BookmarksController {
    bookmarksService;
    constructor(bookmarksService) {
        this.bookmarksService = bookmarksService;
    }
    async findAll(req) {
        const userId = parseInt(req.user.id);
        return this.bookmarksService.findAllByUser(userId);
    }
    async add(req, dto) {
        const userId = parseInt(req.user.id);
        return this.bookmarksService.add(userId, dto);
    }
    async remove(req, bookId) {
        const userId = parseInt(req.user.id);
        return this.bookmarksService.remove(userId, bookId);
    }
    async check(req, bookId) {
        const userId = parseInt(req.user.id);
        return this.bookmarksService.checkBookmark(userId, bookId);
    }
    async toggle(req, bookId) {
        const userId = parseInt(req.user.id);
        return this.bookmarksService.toggle(userId, bookId);
    }
};
exports.BookmarksController = BookmarksController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookmarksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_bookmark_dto_1.CreateBookmarkDto]),
    __metadata("design:returntype", Promise)
], BookmarksController.prototype, "add", null);
__decorate([
    (0, common_1.Delete)(':bookId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BookmarksController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('check/:bookId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BookmarksController.prototype, "check", null);
__decorate([
    (0, common_1.Post)('toggle/:bookId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BookmarksController.prototype, "toggle", null);
exports.BookmarksController = BookmarksController = __decorate([
    (0, common_1.Controller)('bookmarks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bookmarks_service_1.BookmarksService])
], BookmarksController);
//# sourceMappingURL=bookmarks.controller.js.map