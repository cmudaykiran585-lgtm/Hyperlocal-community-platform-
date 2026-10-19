import express from 'express';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Booking from '../models/Booking.js';
import SupportTicket from '../models/SupportTicket.js';
import CommunityReport from '../models/CommunityReport.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats (Platform metrics aggregated from actual MongoDB documents)
router.get('/stats', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [totalUsers, totalProviders, verifiedProviders, pendingProviders, totalBookings, completedBookings, totalTickets] = await Promise.all([
      User.countDocuments(),
      ProviderProfile.countDocuments(),
      ProviderProfile.countDocuments({ isVerified: true }),
      ProviderProfile.countDocuments({ isVerified: false }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Completed' }),
      SupportTicket.countDocuments({ status: 'Open' })
    ]);

    const bookings = await Booking.find({ status: 'Completed' }).select('price');
    const totalVolume = bookings.reduce((sum, b) => sum + (b.price || 0), 0);

    res.json({
      ok: true,
      data: {
        success: true,
        stats: {
          totalUsers,
          totalProviders,
          verifiedProviders,
          pendingProviders,
          totalBookings,
          completedBookings,
          totalVolume,
          openTickets: totalTickets,
          database: 'MongoDB Atlas'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/admin/users (List all registered users)
router.get('/users', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: {
        success: true,
        count: users.length,
        users
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/admin/providers (List all providers with verification statuses)
router.get('/providers', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const providers = await ProviderProfile.find().sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: {
        success: true,
        count: providers.length,
        providers
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/admin/providers/:id/verify (Toggle or set verification approval)
router.patch('/providers/:id/verify', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, verificationStatus, verificationBadge } = req.body;

    const provider = await ProviderProfile.findOne({ id });
    if (!provider) {
      return res.status(404).json({ ok: false, error: `Provider '${id}' not found` });
    }

    if (isVerified !== undefined) {
      provider.isVerified = Boolean(isVerified);
    } else {
      provider.isVerified = !provider.isVerified;
    }

    if (verificationStatus) {
      provider.verificationStatus = verificationStatus;
    } else {
      provider.verificationStatus = provider.isVerified ? 'approved' : 'pending';
    }

    if (verificationBadge) {
      provider.verificationBadge = verificationBadge;
    } else {
      provider.verificationBadge = provider.isVerified ? 'Government ID & Guild Verified' : 'Pending Verification';
    }

    await provider.save();

    console.log(`[Admin] Provider ${provider.name} verification updated: isVerified=${provider.isVerified}, status=${provider.verificationStatus}`);

    res.json({
      ok: true,
      data: {
        success: true,
        provider,
        message: `Provider ${provider.name} verification status updated to '${provider.verificationStatus}'`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/admin/bookings (List all platform bookings)
router.get('/bookings', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: {
        success: true,
        count: bookings.length,
        bookings
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/admin/tickets (List support tickets)
router.get('/tickets', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: {
        success: true,
        tickets
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/admin/tickets/:id (Update ticket status)
router.patch('/tickets/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const ticket = await SupportTicket.findOne({ id });
    if (!ticket) {
      return res.status(404).json({ ok: false, error: `Ticket #${id} not found` });
    }

    if (status) ticket.status = status;
    if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;

    await ticket.save();

    res.json({
      ok: true,
      data: {
        success: true,
        ticket,
        message: `Ticket #${id} updated to ${status}`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/admin/users/:id/status (Suspend or reactivate user account)
router.patch('/users/:id/status', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    user.accountStatus = accountStatus || 'active';
    await user.save();

    res.json({
      ok: true,
      data: {
        success: true,
        user: user.toJSON(),
        message: `User account status set to ${user.accountStatus}`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
