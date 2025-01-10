import express from 'express';
import webhookRouter from './routes/webhook';
import { startScheduler } from './startScheduler';
import { AddressInfo } from 'net';

const app = express();

// Mount the webhook router
app.use(webhookRouter);

// Start the scheduler
startScheduler();

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
  console.log(`Webhook endpoint available at http://localhost:${port}/webhook`);
});
