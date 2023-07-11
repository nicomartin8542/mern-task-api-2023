import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Proyect } from 'src/proyect/entities/proyect.entity';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({
    require: true,
    trim: true,
    unique: true,
  })
  name: string;

  @Prop({
    require: true,
    trim: true,
  })
  description: string;

  @Prop({
    default: false,
  })
  estado?: boolean;

  @Prop({
    required: true,
    default: Date.now(),
  })
  fechaEntrega: Date;

  @Prop({
    require: true,
    enum: ['Alta', 'Media', 'Baja'],
  })
  prioridad: string;

  @Prop({
    ref: Proyect.name,
  })
  proyect: Types.ObjectId;
}

const taskSchema = SchemaFactory.createForClass(Task);

export default taskSchema;
