const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: null },
  ruc: { type: String, default: null }, // Nuevo campo para RUC
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String, default: null },
  is2FAEnabled: { type: Boolean, default: false },
  twoFactorCode: { type: String, default: null },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
