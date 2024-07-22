import { Module } from '@nestjs/common';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
  providers: [TasksService, AmqpConnection],
  controllers: [TasksController],
})
export class TasksModule {}
