import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  passwordHash: { type: String, required: false }, // Optional for Google users
  role: String,
  bio: String,
  id: { type: String, unique: true },
  googleId: { type: String, unique: true, sparse: true }, // Google user ID
  profilePicture: String, // Google profile picture URL
});

export default mongoose.model('User', UserSchema);
