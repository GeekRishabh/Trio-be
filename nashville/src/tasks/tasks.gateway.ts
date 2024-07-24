import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';

@WebSocketGateway()
export class TasksGateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly tasksService: TasksService) {}

    /**
     * Handles the creation of a new task via WebSocket.
     * @param createTaskDto - The data to create a new task.
     * @returns The created task.
     */
    @SubscribeMessage('createTask')
    async handleCreateTask(@MessageBody() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.create(createTaskDto);
    }

    /**
     * Handles the updating of a task via WebSocket.
     * @param updateData - Contains task ID and data to update the task.
     * @returns The updated task.
     */
    @SubscribeMessage('updateTask')
    async handleUpdateTask(
        @MessageBody() updateData: { id: string; updateTaskDto: UpdateTaskDto }
    ): Promise<Task> {
        return this.tasksService.update(updateData.id, updateData.updateTaskDto);
    }

    /**
     * Handles the deletion of a task via WebSocket.
     * @param id - The ID of the task to delete.
     * @returns A void promise indicating task deletion.
     */
    @SubscribeMessage('deleteTask')
    async handleDeleteTask(@MessageBody() id: string): Promise<void> {
        return this.tasksService.delete(id);
    }
}
