import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
    default: () => `NX-TICKET-${Math.floor(100000 + Math.random() * 900000)}`
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    default: ''
  },
  subject: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General Support'
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Under Review', 'In-Progress', 'Resolved', 'Closed'],
    default: 'Open',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  resolutionNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export default SupportTicket;
