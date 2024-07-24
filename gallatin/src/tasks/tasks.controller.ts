import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';

/**
 * Controller for handling gRPC tasks related requests.
 */
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Creates a new task.
   * @param data The data to create a new task.
   * @returns The created task.
   */
  @GrpcMethod('TaskService', 'Create')
  create(data: CreateTaskDto) {
    return this.tasksService.create(data);
  }

  /**
   * Retrieves all tasks.
   * @returns An array of tasks.
   */
  @GrpcMethod('TaskService', 'FindAll')
  findAll(page: number, limit: number, sort?: string, filter?: string, search?: string) {
    return { tasks: this.tasksService.findAll(page, limit, sort, filter, search) };
  }

  /**
   * Retrieves a task by ID.
   * @param data The ID of the task.
   * @returns The task with the given ID.
   */
  @GrpcMethod('TaskService', 'FindOne')
  findOne(data: { id: string }) {
    return this.tasksService.findOne(data.id);
  }
}
