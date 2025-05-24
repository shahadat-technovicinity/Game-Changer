import express from 'express';
import { Controller } from './controller';
const router = express.Router();

router.get('/generate-token', Controller.getAgoraToken);

export {router as liveStreamingRouter};