// src/routes/mock.routes.ts
import { Router, RequestHandler } from 'express';
import { executeMock } from '../controllers/mockEngine.controller';

const router = Router();
router.use('/', executeMock as RequestHandler);

export default router;


