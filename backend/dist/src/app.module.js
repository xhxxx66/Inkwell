"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const books_module_1 = require("./books/books.module");
const categories_module_1 = require("./categories/categories.module");
const chapters_module_1 = require("./chapters/chapters.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const bookmarks_module_1 = require("./bookmarks/bookmarks.module");
const reading_records_module_1 = require("./reading-records/reading-records.module");
const search_module_1 = require("./search/search.module");
const ai_module_1 = require("./ai/ai.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            books_module_1.BooksModule,
            categories_module_1.CategoriesModule,
            chapters_module_1.ChaptersModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            bookmarks_module_1.BookmarksModule,
            reading_records_module_1.ReadingRecordsModule,
            search_module_1.SearchModule,
            ai_module_1.AiModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map