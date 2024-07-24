import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { Logger } from '@nestjs/common';

/**
 * Unit tests for the LoggerService.
 */
describe('LoggerService', () => {
  let service: LoggerService;
  let elasticsearchService: ElasticsearchService;

  // Mock ElasticsearchService
  const elasticsearchServiceMock = {
    indexLog: jest.fn(),
  };

  beforeEach(async () => {
    // Create a testing module with LoggerService and mock ElasticsearchService
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        { provide: ElasticsearchService, useValue: elasticsearchServiceMock },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
    elasticsearchService =
      module.get<ElasticsearchService>(ElasticsearchService);
  });

  /**
   * Tests logging an event.
   * Verifies that the event is logged to the console and Elasticsearch.
   */
  it('should log an event', async () => {
    // Arrange
    const event = { id: '123', message: 'Test event' };

    // Mock console.log
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    // Act
    await service.logEvent(event);

    // Assert
    // Check if console.log was called with the correct parameters
    expect(consoleLogSpy).toHaveBeenCalledWith('Event received:', event);

    // Check if ElasticsearchService.indexLog was called with correct parameters
    expect(elasticsearchServiceMock.indexLog).toHaveBeenCalledWith(
      'task-logs',
      event,
    );

    // Restore console.log
    consoleLogSpy.mockRestore();
  });
});
