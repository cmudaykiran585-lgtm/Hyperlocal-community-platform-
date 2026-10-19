import mongoose from 'mongoose';

const communityReportSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => `rep-${Date.now()}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true,
    index: true
  },
  address: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  upvotes: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['Under Review', 'Verified & In Progress', 'Resolved', 'Rejected'],
    default: 'Under Review',
    index: true
  },
  history: [{
    status: String,
    note: String,
    date: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const CommunityReport = mongoose.model('CommunityReport', communityReportSchema);
export default CommunityReport;
