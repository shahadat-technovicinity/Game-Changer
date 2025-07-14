// controllers/video.controller.ts
import {UploadCloudinary} from '../utils/uploadCloudinary'; // your cloudinary config
import { User } from '../users/model';
import Video from './model'; // your Video model
import {Event} from '../events/model'; // import your Event mongoose model (adjust the path as needed)
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

const uploadVideo = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const fileSizeMB = req.body.uploadSizeMB;
  const eventId = req.body.event_id; // optional, if related to an event

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file provided' });
  }

  // Upload to Cloudinary
  const result = await UploadCloudinary(req.file);

  // Save video record
  const video = await Video.create({
    user: userId,
    url: result.secure_url,
    size: fileSizeMB,
    event_id: eventId,
  });

  await Event.findByIdAndUpdate(eventId, {
    $push: { uploaded_videos: video.url },
  });

  // Update user storage usage
  await User.findByIdAndUpdate(userId, {
    $inc: { storage_used: fileSizeMB },
  });

  res.status(200).json({
    success: true,
    message: 'Video uploaded successfully',
    video,
  });
});


export const Controller = { uploadVideo };