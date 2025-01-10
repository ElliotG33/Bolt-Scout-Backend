import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscriptionRemark extends Document {
  subscriptionId: mongoose.Types.ObjectId;
  eventType: string; // e.g., 'subscription_created', 'invoice_paid'
  message: string; // A description of the event
  createdAt: Date;
}

const SubscriptionRemarksSchema = new Schema<ISubscriptionRemark>({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    required: [true, 'Subscription ID is required'],
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  createdAt: { type: Date, default: Date.now },
});

const SubscriptionRemark: Model<ISubscriptionRemark> =
  mongoose.models.SubscriptionRemark ||
  mongoose.model<ISubscriptionRemark>(
    'SubscriptionRemark',
    SubscriptionRemarksSchema
  );

export default SubscriptionRemark;
