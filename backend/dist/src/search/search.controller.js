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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const semantic_search_service_1 = require("./semantic-search.service");
const books_service_1 = require("../books/books.service");
let SearchController = class SearchController {
    semanticSearchService;
    booksService;
    constructor(semanticSearchService, booksService) {
        this.semanticSearchService = semanticSearchService;
        this.booksService = booksService;
    }
    async search(keyword, limit = '10', mode = 'semantic') {
        const decodedKeyword = decodeURIComponent(keyword || '');
        const parsedLimit = parseInt(limit, 10) || 10;
        if (!decodedKeyword.trim()) {
            return {
                code: 200,
                msg: 'success',
                data: [],
            };
        }
        try {
            if (mode === 'semantic') {
                const results = await this.semanticSearchService.semanticSearch(decodedKeyword, parsedLimit);
                if (results.length === 0) {
                    const fallback = await this.booksService.search(decodedKeyword, parsedLimit);
                    return fallback;
                }
                return {
                    code: 200,
                    msg: 'success',
                    data: results,
                    mode: 'semantic',
                };
            }
            else {
                return await this.booksService.search(decodedKeyword, parsedLimit);
            }
        }
        catch {
            return await this.booksService.search(decodedKeyword, parsedLimit);
        }
    }
    async reloadVectors() {
        const result = await this.semanticSearchService.reloadVectorData();
        return {
            code: 200,
            msg: 'Vectors reloaded',
            data: result,
        };
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('keyword')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('mode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('reload-vectors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "reloadVectors", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [semantic_search_service_1.SemanticSearchService,
        books_service_1.BooksService])
], SearchController);
//# sourceMappingURL=search.controller.js.map