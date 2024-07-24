import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  config(); // Load environment variables

  // Create an HTTP server instance for Swagger documentation
  const app = await NestFactory.create(AppModule);

  // Set up Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('The task manager API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Start the HTTP server
  await app.listen(process.env.SERVICE_PORT);
  // Create the microservice instance
  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'task',
        protoPath: join(__dirname, './tasks/task.proto'),
        url: `${process.env.SERVICE_HOST}:${process.env.SERVICE_PORT}`,
      },
    });

  // Start the microservice
  microserviceApp.listen();
}

bootstrap();
