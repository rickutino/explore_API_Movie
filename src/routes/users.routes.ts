import { Router } from 'express';
import { UserController } from '../controllers/UsersController';

const usersRoutes = Router();

const userController = new UserController();

usersRoutes.post('/', userController.create);
usersRoutes.put('/:id', userController.update);

export { usersRoutes };