"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueReferralCode = generateUniqueReferralCode;
const model_1 = require("../users/model");
const nanoid_1 = require("nanoid");
const nanoid = (0, nanoid_1.customAlphabet)('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 6);
async function generateUniqueReferralCode() {
    let code;
    let exists = true;
    while (exists) {
        code = nanoid();
        exists = !!(await model_1.User.findOne({ team_code: code }));
    }
    return code;
}
