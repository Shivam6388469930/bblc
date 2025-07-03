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

// Prevent duplicate attendance for same user on same day
attendanceSchema.index({ userEmail: 1, date: 1 }, { unique: true });

// Safe model export to avoid overwrite error
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
export default Attendance;
