import type { Message } from './dto/chat.dto';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
export declare function convertToLangChainMessages(messages: Message[]): (HumanMessage | AIMessage | SystemMessage)[];
export declare class AiService {
    private chatModel;
    constructor();
    chat(messages: Message[], onToken: (token: string) => void): Promise<void>;
}
