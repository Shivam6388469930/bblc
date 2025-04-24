import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  userPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
}, { timestamps: true });

// Safe model export to avoid overwrite error
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;