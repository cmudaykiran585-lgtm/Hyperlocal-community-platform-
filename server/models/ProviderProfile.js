import mongoose from 'mongoose';

const serviceOfferedSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '1 Hour' },
  price: { type: Number, required: true },
  desc: { type: String, default: '' }
}, { _id: false });

const providerProfileSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: [true, 'Provider name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    index: true
  },
  locality: {
    type: String,
    required: [true, 'Primary locality is required'],
    index: true
  },
  rating: {
    type: Number,
    default: 4.8,
    min: 1,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 12
  },
  experienceYears: {
    type: Number,
    default: 5
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: 0
  },
  isVerified: {
    type: Boolean,
    default: true,
    index: true
  },
  verificationBadge: {
    type: String,
    default: 'Verified Specialist Pro'
  },
  verificationStatus: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'approved',
    index: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'
  },
  phone: {
    type: String,
    default: '+91 98450 12345'
  },
  bio: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  servicesOffered: {
    type: [serviceOfferedSchema],
    default: []
  },
  timeSlots: {
    type: [String],
    default: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:30 PM']
  },
  isInPersonAvailable: {
    type: Boolean,
    default: true
  },
  isOnlineAvailable: {
    type: Boolean,
    default: false
  },
  availabilityText: {
    type: String,
    default: 'Today: 2 Slots Open'
  },
  workingHours: {
    type: String,
    default: 'Mon - Sat: 8:00 AM - 8:00 PM'
  },
  coordinates: {
    lat: { type: Number, default: 12.9716 },
    lng: { type: Number, default: 77.5946 }
  }
}, {
  timestamps: true
});

const ProviderProfile = mongoose.model('ProviderProfile', providerProfileSchema);
export default ProviderProfile;
