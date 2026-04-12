import { Request, Response } from 'express';
import { ChatService } from '../services/ChatService';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ChatService.getMessages(req.params.rideId as any);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const message = await ChatService.sendMessage(req.params.rideId as any, senderId, req.body.content);
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const pinMessage = async (req: Request, res: Response) => {
  try {
    const message = await ChatService.pinMessage(req.params.messageId as any);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
