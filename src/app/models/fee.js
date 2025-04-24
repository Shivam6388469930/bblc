import mongoose, { Schema } from 'mongoose';

const feeSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  totalFee: {
    type: Number,
    required: true,
    default: 0,
  },
  submitFee: {
    type: Number,
    required: true,
    default: 0,
  },
  balanceFee: {
    type: Number,
    required: true,
    default: 0,
  },
}, { timestamps: true });

// ✅ Avoid model overwrite issue in development
const Fee = mongoose.models.Fee || mongoose.model('Fee', feeSchema);

export default Fee;
