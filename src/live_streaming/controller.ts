import { generateAgoraToken } from '../utils/agora';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { Request, Response } from 'express';

const getAgoraToken = catchAsync(async (req: Request, res: Response) => {
  const { channelName, uid, role } = req.query;

  if (!channelName || !uid) {
     throw new AppError ('Missing channelName or uid', 400);
  }

  try {
    const token = generateAgoraToken(
      channelName as string,
      uid as string,
      role as 'publisher' | 'subscriber'
    );
    console.log("Role: ", role,", Token: ", token);
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Token generation failed' });
  }
});

export const Controller = {getAgoraToken};