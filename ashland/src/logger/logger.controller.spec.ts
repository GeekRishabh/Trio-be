import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

/**
 * Unit tests for the LoggerController.
 */
describe('LoggerController', () => {
  let controller: LoggerController;
  let loggerService: LoggerService;

  // Mock LoggerService
  const loggerServiceMock = {
    logEvent: jest.fn(),
  };

  beforeEach(async () => {
    // Create a testing module with LoggerController and mock LoggerService
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggerController],
      providers: [{ provide: LoggerService, useValue: loggerServiceMock }],
    }).compile();

    controller = module.get<LoggerController>(LoggerController);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  /**
   * Tests handling of 'task_created' event.
   * Verifies that logEvent is called with the correct message.
   */
  it('should handle task_created event', () => {
    // Arrange
    const eventData = { id: '1', name: 'New Task' };
    const expectedMessage = `Task Created: ${JSON.stringify(eventData)}`;

    // Act
    controller.handleTaskCreated(eventData);

    // Assert
    expect(loggerServiceMock.logEvent).toHaveBeenCalledWith(expectedMessage);
  });

  /**
   * Tests handling of 'task_updated' event.
   * Verifies that logEvent is called with the correct message.
   */
  it('should handle task_updated event', () => {
    // Arrange
    const eventData = { id: '1', name: 'Updated Task' };
    const expectedMessage = `Task Updated: ${JSON.stringify(eventData)}`;

    // Act
    controller.handleTaskUpdated(eventData);

    // Assert
    expect(loggerServiceMock.logEvent).toHaveBeenCalledWith(expectedMessage);
  });

  /**
   * Tests handling of 'task_deleted' event.
   * Verifies that logEvent is called with the correct message.
   */
  it('should handle task_deleted event', () => {
    // Arrange
    const eventData = { id: '1', name: 'Deleted Task' };
    const expectedMessage = `Task Deleted: ${JSON.stringify(eventData)}`;

    // Act
    controller.handleTaskDeleted(eventData);

    // Assert
    expect(loggerServiceMock.logEvent).toHaveBeenCalledWith(expectedMessage);
  });
});
