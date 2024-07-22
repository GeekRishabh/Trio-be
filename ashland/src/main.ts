import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';


async function bootstrap() {
  config(); // Load environment variables
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
}
bootstrap();
