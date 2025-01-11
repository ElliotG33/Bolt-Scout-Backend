import mongoose, { Schema, Document, Model } from 'mongoose';
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  stripeCustomerId: string; // Store Stripe Customer ID
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isAdmin: boolean;
  forgotPasswordToken: string;
  forgotPasswordTokenExpiry: string;
  verifyToken: string;
  verifyTokenExpiry: Date;
}

const UserSchema = new Schema<IUser>({
  stripeCustomerId: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide an email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password.'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
