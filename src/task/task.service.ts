import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Proyect } from 'src/proyect/entities/proyect.entity';
import { Task } from './entities/task.entity';
import { ProyectService } from 'src/proyect/proyect.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
    @InjectModel(Proyect.name)
    private readonly proyectModel: Model<Proyect>,
    private readonly proyectService: ProyectService,
  ) {}

  logger = new Logger('Proyect');

  async create(createTaskDto: CreateTaskDto) {
    const { proyect } = createTaskDto;

    const proyectDoc = await this.proyectModel.findById(proyect);

    if (!proyectDoc) throw new NotFoundException('Proyect not found');

    const task = new this.taskModel(createTaskDto);

    try {
      await task.save();
      return task.toObject();
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  async findOne(id: Types.ObjectId) {
    const task = await this.taskModel.findById(id);
    return task;
  }

  async findTaskProyect(proyectId: Types.ObjectId, userId: string) {
    const proyect = await this.proyectService.findOne(proyectId, userId);

    if (!proyect) throw new NotFoundException('Proyect not found!');

    const task = await this.taskModel
      .find({ proyect: proyect.id })
      .select('-__v -createdAt -updatedAt');
    if (!task) throw new NotFoundException('Task not found!');

    return {
      ...proyect.toObject(),
      tasks: task,
    };
  }

  async update(id: Types.ObjectId, updateTaskDto: UpdateTaskDto) {
    const { proyect } = updateTaskDto;
    let proyectDoc: any;

    if (proyect) {
      proyectDoc = await this.proyectModel.findById(proyect);
      if (!proyectDoc) throw new NotFoundException('Proyect not found!');
    }

    const task = await this.taskModel.findById(id);

    if (!task) throw new NotFoundException('Task not found!');

    try {
      await task.updateOne({ ...updateTaskDto });
      return { ...task.toObject(), ...updateTaskDto };
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  async remove(id: Types.ObjectId) {
    const task = await this.taskModel.findById(id);

    if (!task) throw new NotFoundException('Task not found!');

    try {
      await this.taskModel.deleteOne({ _id: id });
      return 'Succes';
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  private handleExcepcionError(error: any): never {
    this.logger.error(error.message);
    if (error.code === 11000)
      throw new BadRequestException('Task already exits!');

    throw new InternalServerErrorException(error);
  }
}
