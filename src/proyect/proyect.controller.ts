import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProyectService } from './proyect.service';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { Auth } from 'src/auth/docorators/auth.decorator';
import { GetUser } from 'src/auth/docorators/get-user.decorator';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';

@Controller('proyect')
export class ProyectController {
  constructor(private readonly proyectService: ProyectService) {}

  //Crud de Proyectos
  @Auth()
  @Post()
  createProyect(
    @Body() createProyectDto: CreateProyectDto,
    @GetUser() id: Types.ObjectId,
  ) {
    return this.proyectService.create(createProyectDto, id);
  }

  @Auth()
  @Get()
  findAllProyect(@GetUser('_id') id: Types.ObjectId) {
    return this.proyectService.findAll(id);
  }

  @Auth()
  @Get(':id')
  findOneProyect(
    @Param('id', ParseMongoIdPipe) idProyect: Types.ObjectId,
    @GetUser('id') userId: string,
  ) {
    return this.proyectService.findOne(idProyect, userId);
  }

  @Auth()
  @Patch(':id')
  update(
    @Param('id', ParseMongoIdPipe) proyectId: Types.ObjectId,
    @Body() updateProyectDto: UpdateProyectDto,
    @GetUser('id') userId: string,
  ) {
    return this.proyectService.update(proyectId, updateProyectDto, userId);
  }

  @Auth()
  @Delete(':id')
  remove(
    @Param('id', ParseMongoIdPipe) proyectId: Types.ObjectId,
    @GetUser('id') userId: string,
  ) {
    return this.proyectService.remove(proyectId, userId);
  }

  // Otros controladores

  @Post(':id')
  addCollaborator(
    @Param() id: string,
    @Body() createProyectDto: CreateProyectDto,
  ) {
    return 'Add collaborator';
  }

  @Post(':id')
  removeCollaborator(
    @Param() id: string,
    @Body() createProyectDto: CreateProyectDto,
  ) {
    return 'Remove Collaborator';
  }
}
