export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
export declare class ChatDto {
    messages: Message[];
}
