import mongoose from 'mongoose';
import { UserModel } from './user.js';
import { PostModel } from './post.js';

async function main() {
  mongoose.set('strictQuery', true);
  await mongoose.connect('mongodb://127.0.0.1:27017/test')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar:', err));

  // Crear un nuevo post
  const newPost = new PostModel({
    title: 'Mi primer post',
    content: 'Este es mi primer post en el blog.'
  });
  await newPost.save();

  console.log('Post creado:', newPost);

  // Crear un usuario con referencia al post
  const newUser = new UserModel({
    name: 'Alice',
    email: 'alice@example.com',
    avatar: 'https://i.imgur.com/example.png',
    posts: [newPost._id] // Guardamos la referencia al post
  });
  await newUser.save();

  console.log('Usuario creado:', newUser);

  // Obtener usuario y popular los posts
  const user = await UserModel.findOne({ email: 'alice@example.com' }).populate('posts');
  console.log('Usuario con posts:', user);

  // Agregar otro post a un usuario existente
  const anotherPost = new PostModel({
    title: 'Segundo post',
    content: 'Este es otro post.'
  });
  await anotherPost.save();

  await UserModel.updateOne(
    { email: 'alice@example.com' },
    { $push: { posts: anotherPost._id } }
  );
  console.log('Post agregado al usuario');

  // Editar un post
  await PostModel.updateOne(
    { _id: newPost._id },
    { $set: { content: 'Contenido actualizado' } }
  );
  console.log('Post actualizado');

  // Eliminar un post
  await UserModel.updateOne(
    { email: 'alice@example.com' },
    { $pull: { posts: newPost._id } }
  );
  await PostModel.deleteOne({ _id: newPost._id });
  console.log('Post eliminado');

  // Obtener todos los usuarios con sus posts
  const usersWithPosts = await UserModel.find().populate('posts').lean();
  console.log('Usuarios con posts:', usersWithPosts);

  // Agregación: Obtener número de posts por usuario
  const aggregation = await UserModel.aggregate([
    { $project: { name: 1, numPosts: { $size: { $ifNull: ['$posts', []] } } } }
  ]);
  console.log('Agregación:', aggregation);
}

main();