import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Post CRUD
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.post('/', postController.createPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);

// Post interactions
router.post('/:id/like', postController.toggleLike);
router.post('/:id/comments', postController.addComment);
router.get('/:id/comments', postController.getComments);

export default router;
