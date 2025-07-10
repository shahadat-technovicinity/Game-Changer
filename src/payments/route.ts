// routes/payment.route.ts
import express from 'express';
import { Controller } from './controller';

const router = express.Router();

router.post('/buy-package', Controller.createPaymentIntent);         // Client payment creation
router.post('/webhook', express.raw({ type: 'application/json' }), Controller.handleWebhook); // Stripe webhook

export default router;
