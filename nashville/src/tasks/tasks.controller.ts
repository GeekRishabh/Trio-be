import {
    Controller,
    Get,
    Put,
    Delete,
    Post,
    Body,
    Param,
    Query,
    UsePipes,
    ValidationPipe,
    UseFilters,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

/**
 * Controller for handling tasks related requests.
 */
@ApiTags('tasks')
@Controller('tasks')
@UseFilters(AllExceptionsFilter)
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    /**
     * Creates a new task.
     * @param createTaskDto - The data to create a new task.
     * @returns The created task.
     * @throws HttpException - Throws an error if task creation fails.
     */
    @ApiOperation({ summary: 'Create a new task' })
    @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        try {
            return await this.tasksService.create(createTaskDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all tasks.
     * @param page - The page number for pagination (default: 1).
     * @param limit - The number of items per page (default: 10).
     * @param sort - The sorting criteria.
     * @param filter - The filtering criteria.
     * @param search - The search keyword.
     * @returns An array of tasks.
     * @throws HttpException - Throws an error if task retrieval fails.
     */
    @ApiOperation({ summary: 'Get all tasks' })
    @ApiResponse({ status: 200, description: 'All tasks retrieved successfully.' })
    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('sort') sort?: string,
        @Query('filter') filter?: string,
        @Query('search') search?: string
    ): Promise<{ data: Task[]; count: number }> {
        try {
            return await this.tasksService.findAll(page, limit, sort, filter, search);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves a task by ID.
     * @param id - The ID of the task.
     * @returns The task with the given ID.
     * @throws HttpException - Throws an error if task retrieval fails.
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
     * Updates a task by ID.
     * @param id - The ID of the task.
     * @param updateTaskDto - The data to update the task.
     * @returns The updated task.
     * @throws HttpException - Throws an error if task update fails.
     */
    @ApiOperation({ summary: 'Update task' })
    @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
        try {
            return await this.tasksService.update(id, updateTaskDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a task by ID.
     * @param id - The ID of the task.
     * @returns A void promise indicating task deletion.
     * @throws HttpException - Throws an error if task deletion fails.
     */
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
