import express from 'express';
import { contact, subscribe, getSubscribers } from '../controllers/emailController.js';

const router = express.Router();

router.post('/contact', contact);
router.post('/subscribe', subscribe);
router.get('/subscribers', getSubscribers);

export default router;