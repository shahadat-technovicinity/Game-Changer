"use strict";
// import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAgoraToken = void 0;
// export const generateAgoraToken = (channelName: string, uid: string) => {
//   const appID = process.env.AGORA_APP_ID || '2114af7263a24867bff36ac321e56ee0';
//   const appCertificate = process.env.AGORA_APP_CERTIFICATE || '7cc6deb69c5149ec988eaa703f274fb6';
//   const expirationTimeInSeconds = 3600;
//   const role = RtcRole.PUBLISHER;
//   const currentTimestamp = Math.floor(Date.now() / 1000);
//   const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
//   return RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, parseInt(uid), role, privilegeExpiredTs);
// };
const agora_access_token_1 = require("agora-access-token");
const generateAgoraToken = (channelName, uid, role = 'subscriber' // default to audience
) => {
    const appID = process.env.AGORA_APP_ID || '2114af7263a24867bff36ac321e56ee0';
    const appCertificate = process.env.AGORA_APP_CERTIFICATE || '7cc6deb69c5149ec988eaa703f274fb6';
    const expirationTimeInSeconds = 3600;
    const agoraRole = role === 'publisher' ? agora_access_token_1.RtcRole.PUBLISHER : agora_access_token_1.RtcRole.SUBSCRIBER;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    return agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, parseInt(uid.toString()), agoraRole, privilegeExpiredTs);
};
exports.generateAgoraToken = generateAgoraToken;
