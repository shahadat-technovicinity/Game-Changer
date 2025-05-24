"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const agora_1 = require("../utils/agora");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const getAgoraToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { channelName, uid, role } = req.query;
    if (!channelName || !uid) {
        throw new appError_1.AppError('Missing channelName or uid', 400);
    }
    try {
        const token = (0, agora_1.generateAgoraToken)(channelName, uid, role);
        console.log("Role: ", role, ", Token: ", token);
        return res.json({ token });
    }
    catch (err) {
        return res.status(500).json({ error: 'Token generation failed' });
    }
});
exports.Controller = { getAgoraToken };
