import { Schema, model } from 'mongoose';

// 1. Definir una interfaz para Post
export interface IPost {
  title: string;
  content: string;
  createdAt?: Date;
  _id?: string;
}

// 2. Crear un esquema para Post
const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 3. Crear y exportar el modelo de Post
export const PostModel = model('Post', postSchema);
export { postSchema };