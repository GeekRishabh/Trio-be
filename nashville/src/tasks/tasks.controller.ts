import {
    Controller,
    Get,
    Put,
    Delete,
    Post,
    Body,
    Param,
    Query,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';

/**
 * Controller for handling tasks related requests.
 */
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    /**
     * Creates a new task.
     * @param createTaskDto The data to create a new task.
     * @returns The created task.
     */
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
    @Post()
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        try {
            return await this.tasksService.create(createTaskDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all tasks.
     * @returns An array of tasks.
     */
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'All tasks retrieved successfully.' })
    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sort') sort: string,
        @Query('filter') filter: string,
        @Query('search') search: string
    ): Promise<{ data: Task[]; count: number }> {
        try {
            return await this.tasksService.findAll(page, limit, sort, filter, search);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a task by ID.
     * @param id The ID of the task.
     * @returns The task with the given ID.
     */
    @ApiOperation({ summary: 'Get a task by ID' })
    @ApiResponse({ status: 200, description: 'The task retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Task not found.' })
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Task> {
        try {
            return await this.tasksService.findOne(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a task by ID.
     * @param id The ID of the task.
     * @returns The task with the given ID.
     */
    @ApiOperation({ summary: 'Update task' })
    @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
    @Put(':id')
    async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
        try {
            return await this.tasksService.update(id, updateTaskDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Delete task' })
    @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
    @Delete(':id')
    async deleteTask(@Param('id') id: string): Promise<void> {
        try {
            return await this.tasksService.delete(id);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
