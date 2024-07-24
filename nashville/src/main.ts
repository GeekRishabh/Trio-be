import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
async function bootstrap() {
    config(); // Load environment variables
    const app = await NestFactory.create(AppModule);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Nashville Web API')
        .setDescription('Nashville Web API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    // Create the microservice instance
    const microserviceApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
        transport: Transport.GRPC,
        options: {
            package: 'task',
            protoPath: join(__dirname, './tasks/task.proto'),
            url: `${process.env.GRPC_TASK_SERVICE_URL}`
        }
    });

    // Start the microservice
    microserviceApp.listen();
    await app.listen(process.env.SERVICE_PORT);
}
bootstrap();
