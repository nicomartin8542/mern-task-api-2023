import { Module } from '@nestjs/common';
import { ProyectService } from './proyect.service';
import { ProyectController } from './proyect.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import proyectSchema from './entities/proyect.entity';
import { TaskModule } from 'src/task/task.module';
import { Task } from 'src/task/entities/task.entity';

@Module({
  controllers: [ProyectController],
  providers: [ProyectService],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: 'Proyect',
        schema: proyectSchema,
      },
    ]),
  ],
  exports: [ProyectModule, MongooseModule],
})
export class ProyectModule {}
