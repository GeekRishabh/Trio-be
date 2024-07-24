import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Unit tests for the TasksController class.
 */
describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    // Sample data for tests
    const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'This is a test task',
        parentId: null
    };

    const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated description'
    };

    const task: Partial<Task> = {
        id: '1',
        ...createTaskDto
    };

    const tasks = [task];

    beforeEach(async () => {
        // Mock the TasksService methods
        const mockTasksService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        // Create a testing module with the TasksController and mocked TasksService
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService
                }
            ]
        }).compile();

        // Get the controller and service instances
        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    /**
     * Tests if the TasksController is defined.
     */
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    /**
     * Tests the createTask method of TasksController.
     * It checks if a new task is created successfully and handled correctly.
     */
    describe('createTask', () => {
        it('should create a new task', async () => {
            service.create = jest.fn().mockResolvedValue(task);

            expect(await controller.createTask(createTaskDto)).toBe(task);
            expect(service.create).toHaveBeenCalledWith(createTaskDto);
        });

        it('should throw an HttpException if an error occurs', async () => {
            service.create = jest.fn().mockRejectedValue(new Error('Creation failed'));

            await expect(controller.createTask(createTaskDto)).rejects.toThrow(
                new HttpException('Creation failed', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    /**
     * Tests the findAll method of TasksController.
     * It checks if all tasks are retrieved successfully.
     */
    describe('findAll', () => {
        it('should return an array of tasks', async () => {
            service.findAll = jest.fn().mockResolvedValue({ data: tasks, count: tasks.length });

            expect(await controller.findAll(1, 10)).toEqual({ data: tasks, count: tasks.length });
            expect(service.findAll).toHaveBeenCalledWith(1, 10, undefined, undefined, undefined);
        });

        it('should throw an HttpException if an error occurs', async () => {
            service.findAll = jest.fn().mockRejectedValue(new Error('Retrieval failed'));

            await expect(controller.findAll(1, 10)).rejects.toThrow(
                new HttpException('Retrieval failed', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    /**
     * Tests the findOne method of TasksController.
     * It checks if a single task is retrieved by ID.
     */
    describe('findOne', () => {
        it('should return a task by ID', async () => {
            service.findOne = jest.fn().mockResolvedValue(task);

            expect(await controller.findOne('1')).toBe(task);
            expect(service.findOne).toHaveBeenCalledWith('1');
        });

        it('should throw an HttpException if an error occurs', async () => {
            service.findOne = jest.fn().mockRejectedValue(new Error('Task not found'));

            await expect(controller.findOne('1')).rejects.toThrow(
                new HttpException('Task not found', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    /**
     * Tests the updateTask method of TasksController.
     * It checks if a task is updated successfully.
     */
    describe('updateTask', () => {
        it('should update a task by ID', async () => {
            service.update = jest.fn().mockResolvedValue({ ...task, ...updateTaskDto });

            expect(await controller.updateTask('1', updateTaskDto)).toEqual({
                ...task,
                ...updateTaskDto
            });
            expect(service.update).toHaveBeenCalledWith('1', updateTaskDto);
        });

        it('should throw an HttpException if an error occurs', async () => {
            service.update = jest.fn().mockRejectedValue(new Error('Update failed'));

            await expect(controller.updateTask('1', updateTaskDto)).rejects.toThrow(
                new HttpException('Update failed', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });

    /**
     * Tests the deleteTask method of TasksController.
     * It checks if a task is deleted successfully by ID.
     */
    describe('deleteTask', () => {
        it('should delete a task by ID', async () => {
            service.delete = jest.fn().mockResolvedValue(undefined);

            expect(await controller.deleteTask('1')).toBeUndefined();
            expect(service.delete).toHaveBeenCalledWith('1');
        });

        it('should throw an HttpException if an error occurs', async () => {
            service.delete = jest.fn().mockRejectedValue(new Error('Deletion failed'));

            await expect(controller.deleteTask('1')).rejects.toThrow(
                new HttpException('Deletion failed', HttpStatus.INTERNAL_SERVER_ERROR)
            );
        });
    });
});
