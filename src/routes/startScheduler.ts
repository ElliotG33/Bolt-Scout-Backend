import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { startScheduler } from '../startScheduler';

dotenv.config();

const router = express.Router();
const ALERT_SCHEDULER_TOKEN: string = process.env.ALERT_SCHEDULER_TOKEN!;

router.post('/start-alert-scheduler', (req: Request, res: Response) => {
  // Get the token from query parameters
  const token = req.query.token;
  // Validate the token
  if (token === ALERT_SCHEDULER_TOKEN) {
    // If the token is valid, start the scheduler
    startScheduler();
    res.status(200).send('Scheduler started');
  } else {
    // If the token is invalid, send a 403 Forbidden response
    res.status(403).send('Forbidden: Invalid token');
  }
});
export default router;
