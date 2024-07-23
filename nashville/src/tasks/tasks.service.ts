import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Client, ClientProxy, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CreateTaskDto } from './dto/task.dto';

/**
 * Service for managing tasks via gRPC.
 */
@Injectable()
export class TasksService implements OnModuleInit {
    constructor(@Inject('TASK_SERVICE') private readonly notificationService: ClientProxy) {}

    @Client({
        transport: Transport.GRPC,
        options: {
            package: 'task',
            protoPath: join(__dirname, './task.proto'),
            url: 'localhost:3001'
        }
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
    findAll(page: number, limit: number, sort?: string, filter?: string, search?: string) {
        return this.taskService.findAll(sort, limit, filter, search);
    }

    /**
     * Retrieves a task by ID.
     * @param id The ID of the task.
     * @returns The task with the given ID.
     */
    findOne(id: string) {
        return this.taskService.findOne({ id });
    }

    /**
     * Delete a task by ID.
     * @returns null
     */
    delete(id: string) {
        return this.taskService.deleteOne({ id });
    }

    /**
     * Update a task by ID.
     * @param id The ID of the task.
     * @returns The task with the given ID.
     */
    update(id: string, updateObj: object) {
        return this.taskService.updateOne(id, updateObj);
    }
}
