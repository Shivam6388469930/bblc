import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentType: {
    type: String, // e.g., 'monthly', 'registration', etc.
    required: true,
  },
  paymentStatus: {
    type: String, // e.g., 'Paid', 'Pending', 'Failed'
    default: 'Paid',
  },
  order_id: String,
  razorpay_payment_id: String,
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export default Payment;
