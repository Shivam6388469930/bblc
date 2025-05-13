import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/, // Basic email regex
    },
    userPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite issue in Next.js dev environment
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
