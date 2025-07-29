// controllers/payment.controller.ts
import { Request, Response } from 'express';
import { catchAsync} from '../utils/catchAsync';
import { Message } from './model';

// GET /payment-list?page=1&limit=10&status=succeeded
const messageList = catchAsync(async (req: Request, res: Response) => {
  const { page = 1, limit = 10} = req.query;
  const team_id = req.params.id;
    console.log("TeamId: ", team_id);
  const pageInt = parseInt(page as string);
  const limitInt = parseInt(limit as string);
  const skip = (pageInt - 1) * limitInt;

  const query: any = {};
  if (team_id) {
    query.team_id = team_id;
  }

  const messages = await Message.find(query)
    .populate('player_id', 'first_name last_name image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitInt);

  const total = await Message.countDocuments(query);

  res.status(200).json({
    success: true,
    data: messages,
    currentPage: pageInt,
    totalPages: Math.ceil(total / limitInt),
    totalPayments: total,
    
  });
});

export const Controller = {messageList};
