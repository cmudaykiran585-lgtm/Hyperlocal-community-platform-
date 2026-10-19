import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => `NX-${Math.floor(10000 + Math.random() * 90000)}`
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userId: {
    type: String,
    default: 'guest'
  },
  userName: {
    type: String,
    default: 'Resident User'
  },
  providerId: {
    type: String,
    required: [true, 'Provider ID is required'],
    index: true
  },
  providerName: {
    type: String,
    required: [true, 'Provider name is required']
  },
  providerTitle: {
    type: String,
    default: ''
  },
  providerImage: {
    type: String,
    default: ''
  },
  serviceTitle: {
    type: String,
    required: [true, 'Service title is required']
  },
  category: {
    type: String,
    default: 'home-repairs'
  },
  date: {
    type: String,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required']
  },
  mode: {
    type: String,
    enum: ['in-person', 'remote'],
    default: 'in-person'
  },
  locality: {
    type: String,
    default: 'Indiranagar'
  },
  address: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  phone: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'In-Progress', 'Completed', 'Cancelled'],
    default: 'Confirmed',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refunded'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
