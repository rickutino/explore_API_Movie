import { Router } from 'express';

import { usersRoutes } from "./users.routes";
import { notesRoutes } from "./notes.routes";
import { tagsRoutes } from "./tags.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/notes", notesRoutes);
router.use("/tags", tagsRoutes);

export { router };