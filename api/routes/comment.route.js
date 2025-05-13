import express from 'express';
import { createComment } from '../controllers/comment.contoller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create',verifyToken, createComment);

export default router;