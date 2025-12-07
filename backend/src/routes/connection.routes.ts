import { Router } from 'express';
import { connectionController } from '../controllers/connection.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Connection routes
router.post('/:id/follow', connectionController.followUser);
router.delete('/:id/follow', connectionController.unfollowUser);
router.get('/:id/connection-status', connectionController.getConnectionStatus);
router.get('/:id/followers', connectionController.getFollowers);
router.get('/:id/following', connectionController.getFollowing);
router.get('/:id/follow-counts', connectionController.getFollowCounts);

export default router;
