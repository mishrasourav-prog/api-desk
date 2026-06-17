import { Router, Response, RequestHandler } from 'express';
import { logEmitter } from '../utils/logEmitter';
import { getRecentLogs } from '../controllers/mockEngine.controller';
import { verifyJWT } from '../middlewares/auth.middleware';
import { AuthRequest } from '../types/authRequest';

const router = Router();

router.use(verifyJWT);

router.get("/recent/:username/:deckId", getRecentLogs as RequestHandler);

router.get('/stream/:deckId', (req:AuthRequest, res:Response) => {
    const userId = req.user.id;
    const { deckId } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const eventKey = `new-log:${userId}:${deckId}`;

    const sendLog = (logData: any) => {
        res.write(`data: ${JSON.stringify(logData)}\n\n`);
    };

    logEmitter.on(eventKey, sendLog);

    req.on('close', () => {
        logEmitter.off(eventKey, sendLog);
        res.end();
    });
});

export default router;