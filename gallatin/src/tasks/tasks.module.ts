import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, TaskSchema } from './schemas/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  providers: [TasksService, AmqpConnection],
  controllers: [TasksController],
})
export class TasksModule {}
