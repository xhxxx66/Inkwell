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
exports.ReadingRecordsController = void 0;
const common_1 = require("@nestjs/common");
const reading_records_service_1 = require("./reading-records.service");
const upsert_reading_record_dto_1 = require("./dto/upsert-reading-record.dto");
const jwt_auth_guard_1 = require("../auth/guard/jwt-auth.guard");
let ReadingRecordsController = class ReadingRecordsController {
    readingRecordsService;
    constructor(readingRecordsService) {
        this.readingRecordsService = readingRecordsService;
    }
    async findAll(req, page, pageSize) {
        const userId = parseInt(req.user.id);
        return this.readingRecordsService.findAllByUser(userId, page ? parseInt(page) : 1, pageSize ? parseInt(pageSize) : 20);
    }
    async findByBook(req, bookId) {
        const userId = parseInt(req.user.id);
        return this.readingRecordsService.findByUserAndBook(userId, bookId);
    }
    async findByBooks(req, bookIds) {
        const userId = parseInt(req.user.id);
        return this.readingRecordsService.findByUserAndBooks(userId, bookIds);
    }
    async upsert(req, dto) {
        const userId = parseInt(req.user.id);
        return this.readingRecordsService.upsert(userId, dto);
    }
    async remove(req, bookId) {
        const userId = parseInt(req.user.id);
        return this.readingRecordsService.remove(userId, bookId);
    }
    async clearAll(req) {
        const userId = parseInt(req.user.id);
        return this.readingRecordsService.clearAll(userId);
    }
};
exports.ReadingRecordsController = ReadingRecordsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('pageSize')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ReadingRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('book/:bookId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ReadingRecordsController.prototype, "findByBook", null);
__decorate([
    (0, common_1.Post)('batch'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('bookIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], ReadingRecordsController.prototype, "findByBooks", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upsert_reading_record_dto_1.UpsertReadingRecordDto]),
    __metadata("design:returntype", Promise)
], ReadingRecordsController.prototype, "upsert", null);
__decorate([
    (0, common_1.Delete)('book/:bookId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('bookId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ReadingRecordsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('clear'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReadingRecordsController.prototype, "clearAll", null);
exports.ReadingRecordsController = ReadingRecordsController = __decorate([
    (0, common_1.Controller)('reading-records'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [reading_records_service_1.ReadingRecordsService])
], ReadingRecordsController);
//# sourceMappingURL=reading-records.controller.js.map