import { Controller, Post, Body, Res } from '@nestjs/common';
import { AiService } from './ai.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto, @Res() res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await this.aiService.chat(chatDto.messages, (token: string) => {
        res.write(`0:${JSON.stringify({ token })}\n`);
      });
      res.end();
    } catch {
      res.status(500).end();
    }
  }
}
