// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User schema representing an account in the system.
 * Fields:
 *   - name: full name of the user
 *   - email: unique email address
 *   - password: hashed password (bcrypt)
 *   - role: "user" by default, "admin" for privileged accounts
 *   - isVerified: whether the email has been verified
 *   - createdAt / updatedAt are handled by timestamps
 */
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre‑save hook to hash password if it has been modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
