"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/payment.route.ts
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.post('/buy-package', controller_1.Controller.createPaymentIntent); // Client payment creation
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), controller_1.Controller.handleWebhook); // Stripe webhook
exports.default = router;
