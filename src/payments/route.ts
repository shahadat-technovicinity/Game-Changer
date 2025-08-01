// routes/payment.route.ts
import express from 'express';
import { Controller } from './controller';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.post('/checkout',protect,Controller.checkout);         // Client payment creation
router.post('/webhook', express.raw({ type: 'application/json' }), Controller.handleWebhook); // Stripe webhook
router.get('/success', Controller.success); // Success page
router.get('/total-earnings', Controller.totalPayment);
router.get('/payment-lists', Controller.paymenlist);
export { router as paymentRouter };
