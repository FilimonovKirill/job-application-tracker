import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const healthCheck = (req: Request, res: Response) => {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'UP' : 'DOWN',
    },
    uptime: process.uptime(),
  };

  const isHealthy = mongoose.connection.readyState === 1;
  res.status(isHealthy ? 200 : 503).json(health);
};
