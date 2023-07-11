import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { Model, Types } from 'mongoose';
import { Proyect } from './entities/proyect.entity';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class ProyectService {
  constructor(
    @InjectModel(Proyect.name)
    private readonly proyectModel: Model<Proyect>,
  ) {}

  //Logger para terminal
  logger = new Logger('Proyect');

  async create(createProyectDto: CreateProyectDto, idUser: Types.ObjectId) {
    const proyect = new this.proyectModel({
      ...createProyectDto,
      createUser: idUser,
    });

    try {
      await proyect.save();
      const proyectPopulate = await proyect.populate({
        path: 'createUser',
        select: '_id name email ',
        options: { lean: true }, // Utilizar lean para retornar un objeto JavaScript plano
      });
      return proyectPopulate;
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  async findAll(userId: Types.ObjectId) {
    //TAmbien se puede hacer asi
    // const proyects = await this.proyectModel
    // .find()
    // .where('createUser')
    // .equals(userId)

    const condition = { createUser: { $eq: userId } };
    const proyects = await this.proyectModel
      .find(condition)
      .select('-__v -createdAt -updatedAt');
    return proyects;
  }

  async findOne(proyectId: Types.ObjectId, userId: string) {
    const proyect = await this.proyectModel
      .findById(proyectId)
      .select('-__v -createdAt -updatedAt');

    if (!proyect) throw new NotFoundException('Proyect not found! ');

    if (proyect.createUser.toString() !== userId)
      throw new UnauthorizedException('User not valid');

    return proyect;
  }

  async update(
    proyectId: Types.ObjectId,
    updateProyectDto: UpdateProyectDto,
    userId: string,
  ) {
    const proyect = await this.findOne(proyectId, userId);

    try {
      await proyect.updateOne({
        ...updateProyectDto,
      });
      return { ...proyect.toObject(), ...updateProyectDto };
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  async remove(proyectId: Types.ObjectId, userId: string) {
    const proyect = await this.findOne(proyectId, userId);

    try {
      await this.proyectModel.deleteOne({ _id: proyect.toObject()._id });
      return proyect;
    } catch (error) {
      this.handleExcepcionError(error);
    }
  }

  private handleExcepcionError(error: any): never {
    this.logger.error(error.message);
    if (error.code === 11000)
      throw new BadRequestException('Proyect already exits!');
    throw new InternalServerErrorException(error);
  }
}
