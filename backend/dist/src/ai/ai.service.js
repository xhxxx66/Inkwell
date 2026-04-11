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
exports.AiService = void 0;
exports.convertToLangChainMessages = convertToLangChainMessages;
const common_1 = require("@nestjs/common");
const deepseek_1 = require("@langchain/deepseek");
const messages_1 = require("@langchain/core/messages");
function convertToLangChainMessages(messages) {
    return messages.map((msg) => {
        switch (msg.role) {
            case 'user':
                return new messages_1.HumanMessage(msg.content);
            case 'assistant':
                return new messages_1.AIMessage(msg.content);
            case 'system':
                return new messages_1.SystemMessage(msg.content);
            default:
                throw new Error(`Unsupported role: ${msg.role}`);
        }
    });
}
let AiService = class AiService {
    chatModel;
    constructor() {
        this.chatModel = new deepseek_1.ChatDeepSeek({
            configuration: {
                apiKey: process.env.DEEPSEEK_API_KEY,
                baseURL: process.env.DEEPSEEK_BASE_URL,
            },
            model: 'deepseek-chat',
            temperature: 0.7,
            streaming: true,
        });
    }
    async chat(messages, onToken) {
        const systemMessage = {
            role: 'system',
            content: `你是一个专业的阅读助手，名叫"墨墨"。你的职责是：
1. 帮助用户推荐适合的书籍
2. 解答用户关于书籍内容的问题
3. 提供阅读建议和读书心得
4. 与用户讨论文学作品

请用友好、专业的语气回答用户的问题。回答要简洁有条理，适当使用 emoji 增加亲和力。`,
        };
        const allMessages = [systemMessage, ...messages];
        const langChainMessages = convertToLangChainMessages(allMessages);
        const stream = await this.chatModel.stream(langChainMessages);
        for await (const chunk of stream) {
            const content = chunk.content;
            if (content) {
                onToken(content);
            }
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map