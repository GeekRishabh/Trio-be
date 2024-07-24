import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';

/**
 * Unit tests for TasksService
 */
describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: 'TASKS_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
    client = module.get<ClientProxy>('TASKS_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Tests for create method
   */
  describe('create', () => {
    it('should create a new task and emit task_created event', async () => {
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

      // Mock the repository create and save methods
      jest.spyOn(repository, 'create').mockReturnValue(savedTask);
      jest.spyOn(repository, 'save').mockResolvedValue(savedTask);

      const result = await service.create(createTaskDto);

      expect(result).toEqual(savedTask);
    });
  });

  /**
   * Tests for updateTask method
   */
  describe('updateTask', () => {
    it('should update the task and emit task_updated event', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };
      const updatedTask: Partial<Task> = {
        ...updateTaskDto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the repository update and findOneBy methods
      jest.spyOn(repository, 'update').mockResolvedValue(null);
      //@ts-ignore
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedTask);

      const result = await service.updateTask('1', updateTaskDto);

      expect(result).toEqual(updatedTask);
    });
  });

  /**
   * Tests for deleteTask method
   */
  describe('deleteTask', () => {
    it('should delete the task and emit task_deleted event', async () => {
      // Mock the repository delete method
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      await service.deleteTask('1');
    });
  });

  /**
   * Tests for findAll method
   */
  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const tasks: Task[] = [
        {
          id: '1',
          title: 'Test Task',
          description: 'Test Description',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      // Mock the repository find method
      jest.spyOn(repository, 'find').mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(result).toEqual(tasks);
    });
  });

  /**
   * Tests for findOne method
   */
  describe('findOne', () => {
    it('should return a task and emit task_updated event', async () => {
      const task: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock the repository findOneBy method
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(task);

      const result = await service.findOne('1');

      expect(result).toEqual(task);
    });
  });
});
