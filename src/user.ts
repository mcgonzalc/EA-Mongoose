import { Schema, model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  avatar?: string;
  posts?: Schema.Types.ObjectId[]; // Usamos ObjectId como referencia
  _id?: string;
}

// Definir el esquema de User con referencia a Post
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }] // Enlace a Post
});

export const UserModel = model<IUser>('User', userSchema);