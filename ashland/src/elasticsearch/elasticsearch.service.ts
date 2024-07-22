import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { config } from 'dotenv';

config(); // Load environment variables

/**
 * Service for interacting with Elasticsearch.
 */
@Injectable()
export class ElasticsearchService {
  private readonly client: Client;
  private readonly logger = new Logger(ElasticsearchService.name);

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_NODE,
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME,
        password: process.env.ELASTICSEARCH_PASSWORD,
      },
    });
  }

  /**
   * Indexes a log entry in Elasticsearch.
   * @param index The index to store the log entry.
   * @param body The log entry data.
   */
  async indexLog(index: string, body: any) {
    try {
      await this.client.index({
        index,
        body,
      });
    } catch (error) {
      this.logger.error('Error indexing log to Elasticsearch', error);
    }
  }
}
