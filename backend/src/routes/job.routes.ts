import { Router } from 'express';
import * as jobController from '../controllers/job.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);
router.post('/', authMiddleware, jobController.createJob);

export default router;
