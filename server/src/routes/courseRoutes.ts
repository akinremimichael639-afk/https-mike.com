import { Router } from 'express';
import { courseController } from '../controllers/courseController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', courseController.getAll);
router.get('/level/:level', courseController.getByLevel);
router.get('/search', courseController.search);

// Admin only routes
router.post('/', requireAuth, courseController.create);
router.put('/:id', requireAuth, courseController.update);
router.delete('/:id', requireAuth, courseController.delete);

export default router;
