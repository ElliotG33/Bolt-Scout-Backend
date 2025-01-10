import mongoose from 'mongoose';
import User from '../models/User';
import Subscription from '../models/Subscription';
import SubscriptionRemark from '../models/SubscriptionRemark';

// Handle subscription creation:customer.subscription.created
export async function handleSubscriptionCreated(subscription: any) {
  const user = await User.findOne({ stripeCustomerId: subscription.customer });
  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  const dbSubscription = await Subscription.create({
    userId: user._id,
    planId: subscription.items.data[0].price.id,
    startDate: new Date(subscription.start_date * 1000),
    endDate: new Date(subscription.current_period_end * 1000),
    status: 'active',
    remarks: [`Subscription created: ${subscription.id}`],
  });

  // Log the subscription remark
  if (dbSubscription) {
    await addSubscriptionRemark(
      dbSubscription._id,
      'customer.subscription.created',
      `Subscription created: ${subscription.id}`
    );
  }
}

// Handle subscription updates (e.g., upgrade, downgrade):customer.subscription.updated
export async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer as string;
  const newPlanId = subscription.items.data[0].price.id; // The new plan ID
  const status = subscription.status;
  const currentPeriodEnd = subscription.current_period_end; // Unix timestamp
  const user = await User.findOne({ stripeCustomerId: customerId });
  if (!user) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  const dbSubscription = await Subscription.findOne({ userId: user._id });
  if (dbSubscription) {
    // Check if the plan has changed
    if (dbSubscription.planId !== newPlanId) {
      dbSubscription.planId = newPlanId; // Update to the new plan
      // Log the subscription remark
      await addSubscriptionRemark(
        dbSubscription._id,
        'customer.subscription.updated',
        `Plan changed from ${dbSubscription.planId} to ${newPlanId}`
      );
    }

    // Update subscription status and end date
    dbSubscription.status = status;
    dbSubscription.endDate = new Date(currentPeriodEnd * 1000); // Convert Unix timestamp to JS Date
    // Save the updated subscription
    await dbSubscription.save();

    // Log the subscription remark
    await addSubscriptionRemark(
      dbSubscription._id,
      'customer.subscription.updated',
      `Subscription updated: status = ${status}, endDate = ${new Date(
        currentPeriodEnd * 1000
      ).toISOString()}`
    );
    console.log(
      `Subscription updated for user ${user._id}: plan = ${newPlanId}, status = ${status}`
    );
  } else {
    console.error(`No subscription found for user ${user._id}`);
  }
}

// Handle subscription cancellation:customer.subscription.deleted
export async function handleSubscriptionDeleted(subscription: any) {
  const user = await User.findOne({ stripeCustomerId: subscription.customer });
  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  const dbSubscription = await Subscription.findOne({
    userId: user._id,
    planId: subscription.items.data[0].price.id,
  });

  if (dbSubscription) {
    dbSubscription.status = 'canceled';
    await dbSubscription.save();

    // Log the subscription remark
    await addSubscriptionRemark(
      dbSubscription._id,
      'customer.subscription.deleted',
      `Subscription canceled: ${subscription.id}`
    );
    console.log('Subscription canceled:', subscription);
  }
}

// Handle successful payment for an invoice:invoice.payment_succeeded
export async function handleInvoicePaymentSucceeded(invoice: any) {
  const subscription = invoice.subscription as string;

  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) {
    console.error('User not found for subscription:', invoice.id);
    return;
  }

  const dbSubscription = await Subscription.findOne({
    userId: user._id,
  });

  if (dbSubscription) {
    dbSubscription.status = 'active';
    await dbSubscription.save();

    // Log the subscription remark
    await addSubscriptionRemark(
      dbSubscription._id,
      'invoice.payment_succeeded',
      `Payment succeeded for subscription: ${subscription}`
    );
  }
  console.log('Payment succeeded:', invoice);
}

// Handle failed payment for an invoice:invoice.payment_failed
export async function handleInvoicePaymentFailed(invoice: any) {
  const subscription = invoice.subscription as string;
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) {
    console.error('User not found for subscription:', invoice.id);
    return;
  }

  const dbSubscription = await Subscription.findOne({
    userId: user._id,
  });

  if (dbSubscription) {
    dbSubscription.status = 'inactive';
    await dbSubscription.save();

    // Log the subscription remark
    await addSubscriptionRemark(
      dbSubscription._id,
      'invoice.payment_failed',
      `Payment failed for subscription: ${subscription}`
    );
  }
  console.log('Payment failed:', invoice);
}

// Handle invoice finalization (optional):invoice.finalized
export async function handleInvoiceFinalized(invoice: any) {
  const subscriptionId = invoice.subscription as string;
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) {
    console.error('User not found for subscription:', invoice.customer);
    return;
  }
  // Log finalized invoice in the subscription remarks
  const dbSubscription = await Subscription.findOne({
    userId: user._id,
  });

  if (dbSubscription) {
    await dbSubscription.save();

    // Log the subscription remark
    await addSubscriptionRemark(
      dbSubscription._id,
      'invoice.finalized',
      `Invoice finalized: ${invoice.id}`
    );
  }
  console.log(`Invoice finalized: ${invoice}`);
}

async function addSubscriptionRemark(
  subscriptionId: mongoose.Types.ObjectId,
  eventType: string,
  message: string
) {
  await SubscriptionRemark.create({
    subscriptionId,
    eventType,
    message,
  });
}
