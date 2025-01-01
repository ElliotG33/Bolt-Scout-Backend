import dotenv from 'dotenv'; // Import dotenv
import cron from 'node-cron';
import connectDB from './db';
import { processAlerts } from './scheduler';
import { sendEmail } from './emailService';

// Load environment variables
dotenv.config();

const startScheduler = async () => {
  try {
    await connectDB();

    // Schedule the alert processor to run every hour
    cron.schedule('* * * * *', async () => {
      console.log(`[${new Date().toISOString()}] Running scheduled task...`);
      try {
        await processAlerts();
        console.log(
          `[${new Date().toISOString()}] Task completed successfully.`
        );
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Error during task execution:`,
          error
        );
      }
    });

    console.log(
      `[${new Date().toISOString()}] Scheduler initialized. Waiting for tasks...`
    );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Failed to start the scheduler:`,
      error
    );
    process.exit(1);
  }

  process.on('SIGINT', async () => {
    console.log(`[${new Date().toISOString()}] Shutting down...`);
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log(`[${new Date().toISOString()}] Shutting down...`);
    process.exit(0);
  });
};

startScheduler();
