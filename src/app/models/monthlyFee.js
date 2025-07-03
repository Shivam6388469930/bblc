import mongoose, { Schema } from 'mongoose';

const monthlyFeeSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  plan: {
    type: String,
    required: true,
    enum: ['Basic', 'Standard', 'Premium'],
  },
  amount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Create index for efficient queries
monthlyFeeSchema.index({ userEmail: 1, isActive: 1 });

const MonthlyFee = mongoose.models.MonthlyFee || mongoose.model('MonthlyFee', monthlyFeeSchema);

export default MonthlyFee;
