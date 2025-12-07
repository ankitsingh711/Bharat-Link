import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { z } from 'zod';

const router = Router();

// Validation schemas (inline for brevity, move to utils/validation later)
const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
});

// Middleware to validate request body
const validate = (schema: z.ZodSchema) => (req: any, res: any, next: any) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({ errors: error.errors });
    }
};

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/verify', authController.verify);
router.post('/resend-code', authController.resendCode);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

export default router;
