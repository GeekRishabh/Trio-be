import { Module } from '@nestjs/common';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksService, AmqpConnection],
  controllers: [TasksController],
})
export class TasksModule {}
