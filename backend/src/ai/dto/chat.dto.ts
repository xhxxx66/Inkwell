export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class ChatDto {
  messages: Message[];
}
