import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    submitFee: {
        type: Number,
        default: 0,
    },
    balanceFee: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Prevent duplicate attendance for same day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
