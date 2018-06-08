import { Router } from 'express';
import { githubPayload } from './services/github/handlers';

const router = Router();

router.get('/githubPayload', githubPayload);
router.get('/githubPayload/:login', githubPayload);

export default router;
