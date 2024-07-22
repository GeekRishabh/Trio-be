import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

/**
 * Bootstrap the application.
 */
async function bootstrap() {
  config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
}
bootstrap();
