// src/routes/mock.routes.ts
import { Router } from 'express';
import { executeMock } from '../controllers/mockEngine.controller';

const router = Router();

// Acts as a catch-all prefix router for this file
router.use('/', executeMock);

export default router;