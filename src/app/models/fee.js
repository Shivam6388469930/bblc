import mongoose, { Schema } from 'mongoose';

const feeSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  course: {
    type: String,
    required: true,
  },
  registrationFee: {
    type: Number,
    required: true,
   
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending',
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

const Fee = mongoose.models.Fee || mongoose.model('Fee', feeSchema);

export default Fee;
