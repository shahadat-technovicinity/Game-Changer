"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const model_1 = require("./model");
// GET /payment-list?page=1&limit=10&status=succeeded
const messageList = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const team_id = req.params.id;
    console.log("TeamId: ", team_id);
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const skip = (pageInt - 1) * limitInt;
    const query = {};
    if (team_id) {
        query.team_id = team_id;
    }
    const messages = await model_1.Message.find(query)
        .populate('player_id', 'first_name last_name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitInt);
    const total = await model_1.Message.countDocuments(query);
    res.status(200).json({
        success: true,
        data: messages,
        currentPage: pageInt,
        totalPages: Math.ceil(total / limitInt),
        totalPayments: total,
    });
});
exports.Controller = { messageList };
