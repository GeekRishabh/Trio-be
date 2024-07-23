import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';

/**
 * Bootstrap the application.
 */
async function bootstrap() {
  config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.SERVICE_PORT || 3002);
}
bootstrap();
