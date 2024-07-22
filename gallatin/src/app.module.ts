import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksModule } from './tasks/tasks.module';

import { DatabaseConnection } from './database/database.connection';

@Module({
  imports: [
    TasksModule,
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
