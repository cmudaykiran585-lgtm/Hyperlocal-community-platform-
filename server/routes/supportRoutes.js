import express from 'express';
import SupportTicket from '../models/SupportTicket.js';
import CommunityReport from '../models/CommunityReport.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// POST /api/support/tickets (File a new support ticket)
router.post('/tickets', optionalAuth, async (req, res) => {
  try {
    const { name, email, subject, category, message, priority } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ ok: false, error: 'Subject and message are required' });
    }

    const ticket = new SupportTicket({
      userId: req.user ? req.user._id : null,
      userName: name || (req.user ? req.user.name : 'Resident User'),
      userEmail: email || (req.user ? req.user.email : ''),
      subject,
      category: category || 'General Support',
      message,
      priority: priority || 'Medium'
    });

    await ticket.save();

    res.status(201).json({
      ok: true,
      data: {
        success: true,
        ticket,
        message: `Support ticket #${ticket.id} submitted successfully`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/support/reports (List community civic reports)
router.get('/reports', async (req, res) => {
  try {
    const reports = await CommunityReport.find().sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: {
        success: true,
        reports
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/support/reports (Submit community civic report)
router.post('/reports', optionalAuth, async (req, res) => {
  try {
    const { title, category, locality, address, description } = req.body;
    if (!title || !description || !locality) {
      return res.status(400).json({ ok: false, error: 'Title, locality, and description are required' });
    }

    const report = new CommunityReport({
      userId: req.user ? req.user._id : null,
      title,
      category: category || 'Civic Infrastructure',
      locality,
      address: address || '',
      description
    });

    await report.save();

    res.status(201).json({
      ok: true,
      data: {
        success: true,
        report,
        message: 'Civic issue report filed and submitted for municipal verification'
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/support/reports/:id/upvote
router.patch('/reports/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    const report = await CommunityReport.findOne({ id });
    if (!report) {
      return res.status(404).json({ ok: false, error: 'Report not found' });
    }

    report.upvotes += 1;
    await report.save();

    res.json({
      ok: true,
      data: {
        success: true,
        upvotes: report.upvotes
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
