"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const model_1 = __importDefault(require("./model"));
const model_2 = require("../storage_packages/model"); // Your package model
const stripe_1 = __importDefault(require("stripe"));
const model_3 = require("../users/model");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const checkout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { packageId } = req.body;
    const userId = req.user?._id;
    const packageData = await model_2.StoragePackage.findById(packageId);
    if (!packageData) {
        return res.status(404).json({ success: false, message: 'StoragePackage not found' });
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: packageData.name,
                        description: packageData.description,
                    },
                    unit_amount: Math.round(packageData.price * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.SERVER_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SERVER_URL}/cancel`,
        metadata: {
            userId: String(userId),
            packageId: String(packageData._id),
        },
    });
    await model_1.default.create({
        user: userId,
        packageId: packageData._id,
        amount: packageData.price,
        currency: 'usd',
        stripePaymentIntentId: session.id,
        status: 'pending',
    });
    res.status(200).json({
        success: true,
        url: session.url, // send the checkout URL to the frontend
        message: 'Checkout session created',
    });
});
const handleWebhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        await model_1.default.findOneAndUpdate({ stripePaymentIntentId: paymentIntent.id }, { status: 'succeeded' });
        // Optional: Give user storage/points access
        const { userId, packageId } = paymentIntent.metadata;
        // Update user balance or features here...
        console.log(`Payment for ${userId} confirmed. StoragePackage ${packageId}`);
    }
    res.status(200).send('Received');
});
const success = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const sessionId = req.query.session_id;
    if (!sessionId) {
        return res.status(400).json({ success: false, message: 'Session ID is required' });
    }
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const stripePaymentIntentId = session.id;
        if (!session.metadata) {
            return res.status(400).json({ success: false, message: 'Session metadata is missing' });
        }
        const userId = session.metadata.userId;
        const packageId = session.metadata.packageId;
        const payment = await model_1.default.findOne({
            stripePaymentIntentId,
            status: 'pending',
            user: userId,
            packageId,
        });
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found or already succeeded' });
        }
        // ✅ Update payment status
        payment.status = 'succeeded';
        await payment.save();
        // ✅ Update user storage
        const user = await model_3.User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const storagePackage = await model_2.StoragePackage.findById(packageId);
        if (!storagePackage) {
            return res.status(404).json({ success: false, message: 'StoragePackage not found' });
        }
        const userStorage = user.storage_size || 0;
        const packageStorage = storagePackage.storage_size || 0;
        user.storage_size = userStorage + packageStorage;
        await user.save();
        return res.status(200).json({
            success: true,
            message: 'Payment successful. Storage upgraded.',
            payment,
        });
    }
    catch (error) {
        console.error('❌ Error in payment success handler:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.Controller = { checkout, handleWebhook, success };
