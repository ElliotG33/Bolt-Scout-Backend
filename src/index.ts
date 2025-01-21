import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import webhookRouter from './routes/webhook';
import startSchedulerRouter from './routes/startScheduler';
import { AddressInfo } from 'net';
import { startScheduler } from './startScheduler';

//load the env variable
dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Bolt Scout Backend Application is running!' });
});

// Mount the webhook router
app.use(webhookRouter);

//Alert Scheduler
app.use(startSchedulerRouter);

// startScheduler();

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
