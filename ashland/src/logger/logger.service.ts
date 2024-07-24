import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';

/**
 * Service for handling logging.
 */
@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * Logs an event to the console and Elasticsearch.
   * @param event The event data to log.
   */
  async logEvent(event: any) {
    this.logger.log('Event received:', event);
    await this.elasticsearchService.indexLog('task-logs', event);
  }
}
