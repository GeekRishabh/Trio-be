import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateTaskDto } from './dto/task.dto';

/**
 * Unit tests for the TasksService class.
 */
describe('TasksService', () => {
    let service: TasksService;
    let mockTaskService: any;

    // Sample data for tests
    const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'This is a test task',
        parentId: null
    };

    const createdTask = {
        id: '1',
        ...createTaskDto,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const tasks = [
        {
            id: '1',
            title: 'Test Task 1',
            description: 'This is test task 1',
            parentId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: '2',
            title: 'Test Task 2',
            description: 'This is test task 2',
            parentId: '1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    const updatedTask = {
        id: '1',
        title: 'Updated Test Task',
        description: 'This is an updated test task',
        parentId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    beforeEach(async () => {
        // Mock the TaskService methods
        mockTaskService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            deleteOne: jest.fn(),
            updateOne: jest.fn()
        };

        // Create a testing module with the TasksService and mocked ClientGrpc
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: 'TASK_SERVICE', // This should match the token used in your service
                    useValue: mockTaskService
                },
                {
                    //@ts-ignore
                    provide: ClientGrpc,
                    useValue: {
                        getService: () => mockTaskService
                    }
                }
            ]
        }).compile();

        // Get the service instance
        service = module.get<TasksService>(TasksService);
    });

    /**
     * Tests if the TasksService is defined.
     */
    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    /**
     * Tests the create method of TasksService.
     * It checks if a new task is created correctly.
     */
    describe('create', () => {
        it('should create a new task', async () => {
            mockTaskService.create.mockResolvedValue(createdTask);

            expect(await service.create(createTaskDto)).toBe(createdTask);
            expect(mockTaskService.create).toHaveBeenCalledWith(createTaskDto);
        });
    });

    /**
     * Tests the findAll method of TasksService.
     * It checks if all tasks are retrieved correctly.
     */
    describe('findAll', () => {
        it('should return an array of tasks', async () => {
            mockTaskService.findAll.mockResolvedValue(tasks);

            expect(await service.findAll(1, 10)).toBe(tasks);
            expect(mockTaskService.findAll).toHaveBeenCalledWith(
                undefined,
                10,
                undefined,
                undefined
            );
        });
    });

    /**
     * Tests the findOne method of TasksService.
     * It checks if a single task is retrieved by ID.
     */
    describe('findOne', () => {
        it('should return a task by ID', async () => {
            const id = '1';
            mockTaskService.findOne.mockResolvedValue(createdTask);

            expect(await service.findOne(id)).toBe(createdTask);
            expect(mockTaskService.findOne).toHaveBeenCalledWith({ id });
        });
    });

    /**
     * Tests the delete method of TasksService.
     * It checks if a task is deleted by ID.
     */
    describe('delete', () => {
        it('should delete a task by ID', async () => {
            const id = '1';
            mockTaskService.deleteOne.mockResolvedValue(null);

            expect(await service.delete(id)).toBe(null);
            expect(mockTaskService.deleteOne).toHaveBeenCalledWith({ id });
        });
    });

    /**
     * Tests the update method of TasksService.
     * It checks if a task is updated by ID.
     */
    describe('update', () => {
        it('should update a task by ID', async () => {
            const id = '1';
            const updateObj = {
                title: 'Updated Test Task',
                description: 'This is an updated test task'
            };
            mockTaskService.updateOne.mockResolvedValue(updatedTask);

            expect(await service.update(id, updateObj)).toBe(updatedTask);
            expect(mockTaskService.updateOne).toHaveBeenCalledWith(id, updateObj);
        });
    });
});
