import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'TASK_SERVICE',
                transport: Transport.GRPC,
                options: {
                    package: 'task',
                    protoPath: join(__dirname, './task.proto'),
                    url: process.env.GRPC_TASK_SERVICE_URL
                }
            }
        ])
    ],
    providers: [TasksService],
    controllers: [TasksController]
})
export class TasksModule {}
