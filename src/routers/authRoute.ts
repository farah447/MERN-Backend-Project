import { Router } from 'express';

import { handleLogin } from '../controllers/authController';

const router = Router()


router.post('/login', handleLogin)


export default router;

