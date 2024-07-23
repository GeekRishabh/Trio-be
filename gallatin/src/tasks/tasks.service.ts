import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

/**
 * Service for managing tasks.
 */
@Injectable()
export class TasksService {
  private client: ClientProxy;
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'tasks_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  /**
   * Creates a new task.
   * @param createTaskDto The data to create a new task.
   * @returns The created task.
   */
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    const savedTask = await this.taskRepository.save(task);
    this.client.emit('task_created', savedTask);
    return savedTask;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.taskRepository.update(id, updateTaskDto);
    const updatedTask = await this.taskRepository.findOneBy({ id });
    this.client.emit('task_updated', updatedTask);
    return updatedTask;
  }

  /**
   * Delete a task by ID.
   * @param id The ID of the task.
   * @returns void
   */
  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.delete(id);
    this.client.emit('task_deleted', id);
  }

  /**
   * Retrieves all tasks.
   * @returns An array of tasks.
   */
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  /**
   * Retrieves a task by ID.
   * @param id The ID of the task.
   * @returns The task with the given ID.
   */
  async findOne(id: string): Promise<Task> {
    return this.taskRepository.findOneBy({ id });
  }
}
