import { Injectable } from '@nestjs/common';
import type { Message } from './dto/chat.dto';
import { ChatDeepSeek } from '@langchain/deepseek';
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from '@langchain/core/messages';

export function convertToLangChainMessages(
  messages: Message[],
): (HumanMessage | AIMessage | SystemMessage)[] {
  return messages.map((msg) => {
    switch (msg.role) {
      case 'user':
        return new HumanMessage(msg.content);
      case 'assistant':
        return new AIMessage(msg.content);
      case 'system':
        return new SystemMessage(msg.content);
      default:
        throw new Error(`Unsupported role: ${msg.role}`);
    }
  });
}

@Injectable()
export class AiService {
  private chatModel: ChatDeepSeek;

  constructor() {
    this.chatModel = new ChatDeepSeek({
      configuration: {
        apiKey: process.env.DEEPSEEK_API_KEY,
        baseURL: process.env.DEEPSEEK_BASE_URL,
      },
      model: 'deepseek-chat',
      temperature: 0.7,
      streaming: true,
    });
  }

  async chat(messages: Message[], onToken: (token: string) => void) {
    const systemMessage: Message = {
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
      const content = chunk.content as string;
      if (content) {
        onToken(content);
      }
    }
  }
}
