import { Module } from '@nestjs/common';
import { AmqpConnection } from '@nestjs-plus/rabbitmq';
import { ClientsModule, Transport, ClientProxyFactory } from '@nestjs/microservices';
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
                    url: 'localhost:3001'
                }
            }
        ])
    ],
    providers: [
        TasksService,
        AmqpConnection,

        {
            provide: 'TASK_SERVICE',
            useFactory: async () => {
                return ClientProxyFactory.create({
                    options: {
                        port: 3001,
                        host: 'localhost'
                    },
                    transport: Transport.TCP
                });
            }
        }
    ],
    controllers: [TasksController],
    exports: ['TASK_SERVICE']
})
export class TasksModule {}
