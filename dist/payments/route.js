"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
// routes/payment.route.ts
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
exports.paymentRouter = router;
router.post('/checkout', auth_1.protect, controller_1.Controller.checkout); // Client payment creation
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), controller_1.Controller.handleWebhook); // Stripe webhook
router.get('/success', controller_1.Controller.success); // Success page
router.get('/total-earnings', controller_1.Controller.totalPayment);
router.get('/payment-lists', controller_1.Controller.paymenlist);
