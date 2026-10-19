import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `rev-${Math.random().toString(36).substring(2, 9)}`,
    index: true
  },
  providerId: {
    type: String,
    required: true,
    index: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customerName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  serviceTitle: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
