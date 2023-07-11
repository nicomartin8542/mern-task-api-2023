import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import taskSchema from './entities/task.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProyectModule } from 'src/proyect/proyect.module';
import { ProyectService } from 'src/proyect/proyect.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, ProyectService],
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Task',
        schema: taskSchema,
      },
    ]),
    AuthModule,
    ProyectModule,
  ],
})
export class TaskModule {}
