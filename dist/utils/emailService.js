"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// utils/emailService.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (to, subject, mailContent) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject,
        html: mailContent,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email Subject:", subject);
};
exports.sendEmail = sendEmail;
