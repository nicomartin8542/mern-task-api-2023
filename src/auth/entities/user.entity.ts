import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({
    trim: true,
    required: true,
  })
  name: string;

  @Prop({
    trim: true,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    trim: true,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    default: '',
  })
  token: string;

  @Prop({ name: 'token_refresh', default: '' })
  tokenRefresh: string;

  @Prop({
    default: false,
  })
  confimado: boolean;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: [String],
    default: ['user'],
  })
  roles: string[];

  // For comparing passwords
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compareSync(password, this.password);
  }
}

const userSchema = SchemaFactory.createForClass(User);

//Hooks
// Antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Borro password cuando termino de guardar un user
userSchema.post('save', function (user: any) {
  delete user._doc.password;
  delete user._doc.__v;
  delete user._doc.createdAt;
  delete user._doc.updatedAt;
  delete user._doc.confimado;
  delete user._doc.isActive;
  delete user._doc.roles;
});

export default userSchema;
