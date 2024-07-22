import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@nestjs-plus/rabbitmq';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';


/**
 * The root module of the Ashland microservice.
 */
@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'task-exchange',
          type: 'topic',
        },
      ],
      uri: process.env.RABBITMQ_URI, // RabbitMQ connection URI
    }),
  ],
  providers: [LoggerService, ElasticsearchService],
})
export class AppModule {}
