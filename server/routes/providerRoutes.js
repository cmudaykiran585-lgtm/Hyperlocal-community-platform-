import express from 'express';
import ProviderProfile from '../models/ProviderProfile.js';
import Booking from '../models/Booking.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/providers (List specialists with filtering)
router.get('/', async (req, res) => {
  try {
    const { category, locality, search, minRating, maxPrice } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (locality && locality !== 'bangalore' && locality !== 'Bangalore (All Areas)') {
      query.locality = new RegExp(locality, 'i');
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (maxPrice) {
      query.hourlyRate = { $lte: Number(maxPrice) };
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { name: regex },
        { title: regex },
        { category: regex },
        { skills: regex },
        { 'servicesOffered.title': regex }
      ];
    }

    const providers = await ProviderProfile.find(query).sort({ rating: -1, isVerified: -1 });
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

// GET /api/providers/me/dashboard (Authenticated provider's dashboard metrics and bookings)
router.get('/me/dashboard', authMiddleware, requireRole('provider', 'admin'), async (req, res) => {
  try {
    const providerId = req.user.providerId || req.query.providerId;
    let profile = null;

    if (providerId) {
      profile = await ProviderProfile.findOne({ id: providerId });
    }

    if (!profile) {
      profile = await ProviderProfile.findOne({ userId: req.user._id });
    }

    if (!profile) {
      return res.status(404).json({
        ok: false,
        error: 'No provider profile associated with this account. Please register your provider profile.'
      });
    }

    // Retrieve all bookings assigned to this provider
    const bookings = await Booking.find({
      $or: [{ providerId: profile.id }, { providerName: profile.name }]
    }).sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;
    const completedBookings = bookings.filter(b => b.status === 'Completed').length;
    const totalEarnings = bookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + (b.price || 0), 0);

    res.json({
      ok: true,
      data: {
        success: true,
        profile,
        stats: {
          totalBookings,
          pendingBookings,
          completedBookings,
          totalEarnings,
          rating: profile.rating,
          reviewsCount: profile.reviewsCount
        },
        bookings
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/providers/me/bookings (Get bookings for logged-in provider)
router.get('/me/bookings', authMiddleware, requireRole('provider', 'admin'), async (req, res) => {
  try {
    const providerId = req.user.providerId;
    let query = {};
    if (providerId) {
      query = { $or: [{ providerId }, { providerName: req.user.name }] };
    } else {
      query = { providerName: req.user.name };
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json({
      ok: true,
      data: {
        success: true,
        bookings
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/providers/me (Update provider pricing, availability, and profile)
router.patch('/me', authMiddleware, requireRole('provider', 'admin'), async (req, res) => {
  try {
    const providerId = req.user.providerId;
    let profile = await ProviderProfile.findOne({
      $or: [{ id: providerId }, { userId: req.user._id }]
    });

    if (!profile) {
      return res.status(404).json({ ok: false, error: 'Provider profile not found' });
    }

    const updatable = [
      'hourlyRate',
      'title',
      'category',
      'locality',
      'bio',
      'skills',
      'servicesOffered',
      'timeSlots',
      'availabilityText',
      'workingHours',
      'isInPersonAvailable',
      'isOnlineAvailable'
    ];

    for (const key of updatable) {
      if (req.body[key] !== undefined) {
        profile[key] = req.body[key];
      }
    }

    await profile.save();

    res.json({
      ok: true,
      data: {
        success: true,
        profile,
        message: 'Provider profile, pricing, and availability updated successfully'
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/providers/:id (Get single provider public profile)
router.get('/:id', async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ id: req.params.id });
    if (!profile) {
      return res.status(404).json({ ok: false, error: `Provider with id '${req.params.id}' not found` });
    }
    res.json({
      ok: true,
      data: {
        success: true,
        provider: profile
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
