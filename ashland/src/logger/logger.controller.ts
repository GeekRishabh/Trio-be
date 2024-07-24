import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { LoggerService } from './logger.service';

@Controller()
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @EventPattern('task_created')
  handleTaskCreated(data: Record<string, unknown>) {
    this.loggerService.logEvent(`Task Created: ${JSON.stringify(data)}`);
  }

  @EventPattern('task_updated')
  handleTaskUpdated(data: Record<string, unknown>) {
    this.loggerService.logEvent(`Task Updated: ${JSON.stringify(data)}`);
  }

  @EventPattern('task_deleted')
  handleTaskDeleted(data: Record<string, unknown>) {
    this.loggerService.logEvent(`Task Deleted: ${JSON.stringify(data)}`);
  }
}
