import { Router, Request, Response, RequestHandler } from 'express';
import { logEmitter } from '../utils/logEmitter';
import { getRecentLogs } from '../controllers/mockEngine.controller';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyJWT);

router.get("/recent/:username", getRecentLogs as RequestHandler);

router.get('/stream/:userId', (req, res) => {

    const { userId } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    const sendLog = (logData: any) => {
        res.write(`data: ${JSON.stringify(logData)}\n\n`);
    };

    logEmitter.on(`new-log:${userId}`, sendLog);

    req.on('close', () => {
        logEmitter.off(`new-log:${userId}`, sendLog);
        res.end();
    });
});


export default router;