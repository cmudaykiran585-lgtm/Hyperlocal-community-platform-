import express from 'express';
import Booking from '../models/Booking.js';
import ProviderProfile from '../models/ProviderProfile.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/bookings (List bookings for active user or provider)
router.get('/', optionalAuth, async (req, res) => {
  try {
    let query = {};

    if (req.user) {
      if (req.user.role === 'admin') {
        // Admin sees all bookings
        query = {};
      } else if (req.user.role === 'provider') {
        // Provider sees bookings assigned to their profile or name
        const pId = req.user.providerId;
        query = {
          $or: [
            ...(pId ? [{ providerId: pId }] : []),
            { providerName: req.user.name },
            { customerId: req.user._id }
          ]
        };
      } else {
        // Customer sees their own bookings
        query = {
          $or: [
            { customerId: req.user._id },
            { userId: req.user._id.toString() },
            { phone: req.user.phone }
          ]
        };
      }
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
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

// POST /api/bookings (Create a new booking in MongoDB)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      providerId,
      providerName,
      providerTitle,
      providerImage,
      serviceTitle,
      category,
      date,
      timeSlot,
      mode,
      locality,
      address,
      notes,
      price,
      phone
    } = req.body;

    if (!providerId || !serviceTitle || !date || !timeSlot) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required booking parameters: providerId, serviceTitle, date, and timeSlot are required'
      });
    }

    // Verify provider profile in MongoDB if possible
    const provider = await ProviderProfile.findOne({ id: providerId });

    const bookingId = req.body.id || `NX-${Math.floor(10000 + Math.random() * 90000)}`;

    const booking = new Booking({
      id: bookingId,
      customerId: req.user ? req.user._id : null,
      userId: req.user ? req.user._id.toString() : (req.body.userId || 'guest'),
      userName: req.user ? req.user.name : (req.body.userName || 'Resident User'),
      providerId: providerId,
      providerName: providerName || (provider ? provider.name : 'Specialist Provider'),
      providerTitle: providerTitle || (provider ? provider.title : ''),
      providerImage: providerImage || (provider ? provider.image : ''),
      serviceTitle: serviceTitle,
      category: category || (provider ? provider.category : 'home-repairs'),
      date,
      timeSlot,
      mode: mode || 'in-person',
      locality: locality || (provider ? provider.locality : 'Indiranagar'),
      address: address || '',
      notes: notes || '',
      price: Number(price) || (provider ? provider.hourlyRate : 500),
      phone: phone || (provider ? provider.phone : ''),
      status: req.body.status || 'Confirmed'
    });

    await booking.save();

    console.log(`[Booking] Created booking ${booking.id} for provider ${booking.providerName} (Fee: ₹${booking.price})`);

    res.status(201).json({
      ok: true,
      data: {
        success: true,
        booking,
        message: `Appointment confirmed! Booking Ref #${booking.id}`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/bookings/:id/status (Accept / Complete / Decline / Cancel booking)
router.patch('/:id/status', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Confirmed', 'Pending', 'In-Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        error: `Invalid status '${status}'. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findOne({ id });
    if (!booking) {
      return res.status(404).json({ ok: false, error: `Booking #${id} not found` });
    }

    booking.status = status;
    if (status === 'Completed') {
      booking.paymentStatus = 'Paid';
    }
    await booking.save();

    console.log(`[Booking] Status updated for #${id} -> ${status}`);

    res.json({
      ok: true,
      data: {
        success: true,
        booking,
        message: `Booking #${id} status updated to ${status}`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOne({ id });
    if (!booking) {
      return res.status(404).json({ ok: false, error: `Booking #${id} not found` });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.json({
      ok: true,
      data: {
        success: true,
        booking,
        message: `Booking #${id} has been cancelled successfully`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
