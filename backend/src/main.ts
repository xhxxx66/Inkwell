import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 开启 CORS
  app.enableCors();
  
  // 全局路由前缀
  app.setGlobalPrefix('api');
  
  // 全局验证管道（配合 DTO）
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
