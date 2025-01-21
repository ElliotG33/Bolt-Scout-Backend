import connectDB from './db';
import cron from 'node-cron';

import { processAlerts } from './scheduler';

export const startScheduler = async () => {
  try {
    await connectDB();

    // Schedule the alert processor to run every hour
    // cron.schedule('* * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running scheduled task...`);
    try {
      await processAlerts();
      console.log(`[${new Date().toISOString()}] Task completed successfully.`);
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Error during task execution:`,
        error
      );
    }
    // });

    // console.log(
    //   `[${new Date().toISOString()}] Scheduler initialized. Waiting for tasks...`
    // );
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Failed to start the scheduler:`,
      error
    );

    // Retry mechanism before exiting
    /*for (let attempt = 1; attempt <= 3; attempt++) {
      console.log(`[${new Date().toISOString()}] Retry attempt ${attempt}...`);
      try {
        await connectDB();
        console.log(
          `[${new Date().toISOString()}] Database connection successful.`
        );
        return startScheduler();
      } catch (retryError) {
        console.error(
          `[${new Date().toISOString()}] Retry failed:`,
          retryError
        );
      }
    }

    console.error(
      `[${new Date().toISOString()}] All retry attempts failed. Exiting...`
    );*/
    process.exit(1); // Exit only after retries fail
  }

  const shutdownHandler = async () => {
    console.log(`[${new Date().toISOString()}] Shutting down...`);
    process.exit(0);
  };

  // Handle process termination signals
  process.on('SIGINT', shutdownHandler);
  process.on('SIGTERM', shutdownHandler);
};
