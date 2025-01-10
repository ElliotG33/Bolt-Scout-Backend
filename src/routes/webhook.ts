import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import {
  handleSubscriptionCreated,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleInvoiceFinalized,
} from '../lib/subscription';

dotenv.config();

const router = express.Router();

const stripeInstance: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});
const endpointSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    const signature = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;
    try {
      event = stripeInstance.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      res.status(400).send(`Stripe Error: ${err}`);
      // if (err instanceof Stripe.errors.StripeError) {
      //   // Handle Stripe-specific errors
      //   console.error(`Stripe Error: ${err.message}`);
      //   res.status(400).send(`Stripe Error: ${err.message}`);
      // } else {
      //   // Handle other types of errors
      //   console.error(`Unexpected Error: ${err}`);
      //   res.status(500).send('Internal Server Error');
      // }
      return;
    }
    // Successfully constructed event
    console.log('✅ Success:', event.id);

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        console.log('=customer.subscription.created', event.data.object);
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        console.log('=customer.subscription.updated', event.data.object);
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        console.log('=customer.subscription.deleted', event.data.object);
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        console.log('=invoice.created', event.data.object);
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        console.log('=invoice.payment_failed', event.data.object);
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case 'invoice.finalized':
        console.log('=invoice.finalized', event.data.object);
        await handleInvoiceFinalized(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
  }
);
export default router;
