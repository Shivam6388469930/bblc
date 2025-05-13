import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    value:{
        type: String,
        required: true,
        enum: ['present', 'absent'],
        default: 'absent',
    }
}, { timestamps: true });

// Prevent duplicate attendance for same day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
