import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerService } from './logger/logger.service';
import { ElasticsearchService } from './elasticsearch/elasticsearch.service';
import { LoggerController } from './logger/logger.controller';
import { LoggerModule } from './logger/logger.module';

/**
 * The root module of the Ashland microservice.
 */
@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    LoggerModule,
  ],
  providers: [LoggerService, ElasticsearchService],
  controllers: [LoggerController],
})
export class AppModule {}
