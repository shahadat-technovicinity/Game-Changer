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
// utils/agora.ts
const agora_access_token_1 = require("agora-access-token");
const generateAgoraToken = (channelName, uid, role = 'publisher' // Changed default to publisher for hosts
) => {
    // Validate environment variables
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    if (!appID || !appCertificate) {
        throw new Error('Agora App ID or Certificate not configured');
    }
    // Validate parameters
    if (!channelName || !uid) {
        throw new Error('Channel name and UID are required');
    }
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    // Convert UID to number (0 means Agora will assign one)
    const numericUid = typeof uid === 'string' ?
        (isNaN(parseInt(uid)) ? 0 : parseInt(uid)) :
        uid;
    const agoraRole = role === 'publisher' ? agora_access_token_1.RtcRole.PUBLISHER : agora_access_token_1.RtcRole.SUBSCRIBER;
    console.log(`Generating token with:
    AppID: ${appID},
    Channel: ${channelName},
    UID: ${numericUid},
    Role: ${role},
    Expires: ${new Date(privilegeExpiredTs * 1000).toISOString()}
  `);
    return agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, numericUid, agoraRole, privilegeExpiredTs);
};
exports.generateAgoraToken = generateAgoraToken;
