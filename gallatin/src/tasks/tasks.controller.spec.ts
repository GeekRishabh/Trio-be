import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/task.dto';
import { Task } from './entities/task.entity';

/**
 * Unit tests for TasksController
 */
describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Tests for create method
   */
  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        parentId: null,
      };
      const savedTask: Task = {
        ...createTaskDto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the service create method
      jest.spyOn(service, 'create').mockResolvedValue(savedTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(savedTask);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  /**
   * Tests for findAll method

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks: Task[] = [{ id: '1', title: 'Test Task', description: 'Test Description', createdAt: new Date(), updatedAt: new Date() }];

      // Mock the service findAll method
      jest.spyOn(service, 'findAll').mockResolvedValue(tasks);

      const result = await controller.findAll();

      expect(result).toEqual({ tasks });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  */

  /**
   * Tests for findOne method
   */
  describe('findOne', () => {
    it('should return a task', async () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the service findOne method
      jest.spyOn(service, 'findOne').mockResolvedValue(task);

      const result = await controller.findOne({ id: '1' });

      expect(result).toEqual(task);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });
});
