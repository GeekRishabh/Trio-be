import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/task.dto';
import { Task, TaskDocument } from './schemas/task.schema';

/**
 * Service for managing tasks.
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  /**
   * Creates a new task.
   * @param createTaskDto The data to create a new task.
   * @returns The created task.
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto);
    await task.save();

    // Emit event to RabbitMQ
    await this.amqpConnection.publish('task-exchange', 'task.created', task);

    return task;
  }

  /**
   * Retrieves all tasks.
   * @returns An array of tasks.
   */
  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  /**
   * Retrieves a task by ID.
   * @param id The ID of the task.
   * @returns The task with the given ID.
   */
  async findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }
}
