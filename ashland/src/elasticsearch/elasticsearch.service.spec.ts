import { Test, TestingModule } from '@nestjs/testing';
import { ElasticsearchService } from './elasticsearch.service';
import { Client } from '@elastic/elasticsearch';

/**
 * Mock implementation of the Elasticsearch client.
 */
jest.mock('@elastic/elasticsearch', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      index: jest.fn(),
    })),
  };
});

describe('ElasticsearchService', () => {
  let service: ElasticsearchService;
  let client: Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElasticsearchService],
    }).compile();

    service = module.get<ElasticsearchService>(ElasticsearchService);
    client = service['client']; // Access the private client for mocking
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('indexLog', () => {
    /**
     * Test indexing a log entry successfully.
     */
    it('should index a log entry successfully', async () => {
      const index = 'test-index';
      const body = { message: 'Test log' };

      client.index.mockResolvedValue({}); // Mock successful index response

      await service.indexLog(index, body);

      expect(client.index).toHaveBeenCalledWith({
        index,
        body,
      });
    });

    /**
     * Test handling an error during indexing.
     */
    it('should log an error if indexing fails', async () => {
      const index = 'test-index';
      const body = { message: 'Test log' };
      const error = new Error('Test error');

      client.index.mockRejectedValue(error); // Mock error response

      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await service.indexLog(index, body);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error indexing log to Elasticsearch',
        error,
      );
    });
  });
});
