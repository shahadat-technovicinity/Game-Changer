"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
// controllers/liveStreaming.ts
const agora_1 = require("../utils/agora");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const getAgoraToken = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { channelName, uid, role = 'publisher' } = req.query; // Default to publisher
    if (!channelName || !uid) {
        throw new appError_1.AppError('Missing channelName or uid', 400);
    }
    // Validate role
    if (role !== 'publisher' && role !== 'subscriber') {
        throw new appError_1.AppError('Invalid role specified', 400);
    }
    try {
        const token = (0, agora_1.generateAgoraToken)(channelName, uid, role);
        console.log(`Generated token for:
      Channel: ${channelName},
      UID: ${uid},
      Role: ${role}
    `);
        return res.json({
            token,
            appId: process.env.AGORA_APP_ID,
            channelName,
            uid,
            role,
            expiresIn: 3600
        });
    }
    catch (err) {
        console.error('Token generation error:', err);
        const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
        throw new appError_1.AppError(`Token generation failed: ${errorMessage}`, 500);
    }
});
exports.Controller = { getAgoraToken };
