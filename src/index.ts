import express, { Request, Response } from 'express';
import webhookRouter from './routes/webhook';
import startSchedulerRouter from './routes/startScheduler';
import { AddressInfo } from 'net';

const app = express();

// Route for root ("/") that shows the application is running
app.get('/', (req, res) => {
  res.status(200).send('Bolt Scout Backend Application is running!');
});

// Mount the webhook router
app.use(webhookRouter);

//Alert Scheduler
app.use(startSchedulerRouter);

// Catch-all handler for invalid routes
app.use((req: Request, res: Response) => {
  console.warn(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).send({ error: '404 - Not Found!' });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  const addressInfo = server.address() as AddressInfo;
  let address = 'localhost';

  if (addressInfo.address === '::') {
    address = 'localhost';
  } else if (addressInfo.address === '0.0.0.0') {
    address = 'localhost';
  }

  console.log(`Server listening at http://${address}:${addressInfo.port}`);
});
export default app;
