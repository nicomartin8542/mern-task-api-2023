import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { Types } from 'mongoose';
import { Auth } from '../auth/docorators/auth.decorator';
import { GetUser } from 'src/auth/docorators/get-user.decorator';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Auth()
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Auth()
  @Post('change-state/:id')
  changeState(@Param('id', ParseMongoIdPipe) idTask: Types.ObjectId) {
    return 'cambiar estado';
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.taskService.findOne(id);
  }

  @Auth()
  @Get('get-proyect/:productId')
  findTasksByProduct(
    @Param('productId', ParseMongoIdPipe) productId: Types.ObjectId,
    @GetUser('id') userId: string,
  ) {
    return this.taskService.findTaskProyect(productId, userId);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) id: Types.ObjectId,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, updateTaskDto);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: Types.ObjectId) {
    return this.taskService.remove(id);
  }
}
