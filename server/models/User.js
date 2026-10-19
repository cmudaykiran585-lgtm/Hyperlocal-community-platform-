import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
  id: { type: String, default: () => 'addr-' + Math.random().toString(36).substring(2, 9) },
  label: { type: String, default: 'Home' },
  address: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required']
  },
  role: {
    type: String,
    enum: ['user', 'provider', 'admin'],
    default: 'user'
  },
  additionalRoles: {
    type: [String],
    default: []
  },
  locality: {
    type: String,
    default: 'Indiranagar',
    trim: true
  },
  address: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
  },
  savedAddresses: {
    type: [addressSchema],
    default: []
  },
  savedProviders: {
    type: [String],
    default: []
  },
  emailVerified: {
    type: Boolean,
    default: true
  },
  phoneVerified: {
    type: Boolean,
    default: true
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'pending'],
    default: 'active'
  },
  providerId: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove passwordHash from JSON transformations
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  return user;
};

// Pre-save password hashing helper if passwordHash is plain text
userSchema.pre('save', async function() {
  if (this.isModified('passwordHash') && !this.passwordHash.startsWith('$2')) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  }
});

const User = mongoose.model('User', userSchema);
export default User;
