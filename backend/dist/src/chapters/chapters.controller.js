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
exports.ChaptersController = void 0;
const common_1 = require("@nestjs/common");
const chapters_service_1 = require("./chapters.service");
const chapter_query_dto_1 = require("./dto/chapter-query.dto");
let ChaptersController = class ChaptersController {
    chaptersService;
    constructor(chaptersService) {
        this.chaptersService = chaptersService;
    }
    async getChaptersByBook(bookId, query) {
        return this.chaptersService.findByBookId(bookId, query);
    }
    async getChapter(id) {
        return this.chaptersService.findOne(id);
    }
};
exports.ChaptersController = ChaptersController;
__decorate([
    (0, common_1.Get)('books/:bookId/chapters'),
    __param(0, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, chapter_query_dto_1.ChapterQueryDto]),
    __metadata("design:returntype", Promise)
], ChaptersController.prototype, "getChaptersByBook", null);
__decorate([
    (0, common_1.Get)('chapters/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChaptersController.prototype, "getChapter", null);
exports.ChaptersController = ChaptersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [chapters_service_1.ChaptersService])
], ChaptersController);
//# sourceMappingURL=chapters.controller.js.map