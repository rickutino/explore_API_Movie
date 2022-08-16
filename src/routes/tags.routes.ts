import { Router } from 'express';
import { TagsController } from '../controllers/TagsController';

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get('/:user_id', tagsController.index);

export { tagsRoutes };