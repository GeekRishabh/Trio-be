import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CreateTaskDto } from './dto/task.dto';

/**
 * Service for managing tasks via gRPC.
 */
@Injectable()
export class TasksService implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'task',
      protoPath: join(__dirname, './task.proto'),
    },
  })
  private client: ClientGrpc;

  private taskService;

  onModuleInit() {
    this.taskService = this.client.getService('TaskService');
  }

  /**
   * Creates a new task.
   * @param createTaskDto The data to create a new task.
   * @returns The created task.
   */
  create(createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  /**
   * Retrieves all tasks.
   * @returns An array of tasks.
   */
  findAll() {
    return this.taskService.findAll({});
  }

  /**
   * Retrieves a task by ID.
   * @param id The ID of the task.
   * @returns The task with the given ID.
   */
  findOne(id: string) {
    return this.taskService.findOne({ id });
  }
}
