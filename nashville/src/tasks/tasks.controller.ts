import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';


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
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  /**
   * Retrieves all tasks.
   * @returns An array of tasks.
   */
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'All tasks retrieved successfully.' })
  @Get()
  findAll() {
    return this.tasksService.findAll();
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
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }
}
