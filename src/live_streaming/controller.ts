// controllers/liveStreaming.ts
import { generateAgoraToken } from '../utils/agora';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response } from 'express';

const getAgoraToken = catchAsync(async (req: Request, res: Response) => {
  const { channelName, uid, role = 'publisher' } = req.query; // Default to publisher

  if (!channelName || !uid) {
    throw new AppError('Missing channelName or uid', 400);
  }

  // Validate role
  if (role !== 'publisher' && role !== 'subscriber') {
    throw new AppError('Invalid role specified', 400);
  }

  try {
    const token = generateAgoraToken(
      channelName as string,
      uid as string,
      role as 'publisher' | 'subscriber'
    );
    
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
  } catch (err) {
    console.error('Token generation error:', err);
    const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
    throw new AppError(`Token generation failed: ${errorMessage}`, 500);
  }
});

export const Controller = { getAgoraToken };