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
        urls: [process.env.RABBITMQ_URI],
        queue: 'tasks_queue',
        queueOptions: {
          durable: true,
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
   * Retrieves all tasks with pagination, sorting, filtering, and searching options.
   * @param page - The page number to retrieve.
   * @param limit - The number of tasks per page.
   * @param sort - The field to sort by. Defaults to 'createdAt:DESC' if not provided.
   * @param filter - The filter criteria in 'key:value' format.
   * @param search - The search term for task title or description.
   * @returns A promise resolving to an array of tasks.
   */
  async findAll(
    page: number,
    limit: number,
    sort?: string,
    filter?: string,
    search?: string,
  ): Promise<Task[]> {
    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Create a query builder to construct the query
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    // Apply search criteria if provided
    if (search) {
      queryBuilder.where(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    // Apply filter criteria if provided
    if (filter) {
      // Assuming filter is a simple key-value pair like "status:active"
      const [key, value] = filter.split(':');
      queryBuilder.andWhere(`task.${key} = :value`, { value });
    }

    // Apply sorting
    if (sort) {
      // Assuming sort is in the format "field:direction" e.g., "createdAt:DESC"
      const [field, direction] = sort.split(':');
      queryBuilder.orderBy(
        `task.${field}`,
        direction.toUpperCase() as 'ASC' | 'DESC',
      );
    } else {
      // Default sorting
      queryBuilder.orderBy('task.createdAt', 'DESC');
    }

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    // Execute the query and return the results
    return queryBuilder.getMany();
  }

  /**
   * Retrieves a task by ID.
   * @param id The ID of the task.
   * @returns The task with the given ID.
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    this.client.emit('task_updated', task);
    return task;
  }
}
