import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';

@Schema({ timestamps: true })
export class Proyect extends Document {
  @Prop({
    trim: true,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    trim: true,
  })
  description: string;

  @Prop({
    default: Date.now(),
    name: 'fecha_entrega',
  })
  fechaEtrega: Date;

  @Prop({
    trim: true,
    required: true,
  })
  cliente: string;

  @Prop({
    ref: User.name,
  })
  createUser: Types.ObjectId;

  @Prop({
    ref: User.name,
  })
  collaborators: Types.ObjectId[];
}

const proyectSchema = SchemaFactory.createForClass(Proyect);

proyectSchema.post('save', function (proyect: any) {
  delete proyect._doc.updatedAt;
  delete proyect._doc.createdAt;
  delete proyect._doc.__v;
});

export default proyectSchema;
