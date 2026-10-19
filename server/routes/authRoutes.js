import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// In-memory OTP storage with TTL
const activeOtps = new Map();

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// GET /api/auth/gateway-status
router.get('/gateway-status', (req, res) => {
  res.json({
    ok: true,
    data: {
      success: true,
      status: {
        operational: true,
        database: 'MongoDB Atlas / Live',
        devTestingAvailable: true,
        gateway: 'Nexora Core Gateway v2.4 (MongoDB Native)'
      }
    }
  });
});

// POST /api/auth/signup/request-otp
router.post('/signup/request-otp', async (req, res) => {
  try {
    const { name, identifier, type, password, role, locality } = req.body;

    if (!identifier) {
      return res.status(400).json({ ok: false, error: 'Identifier (email or mobile) is required' });
    }

    const email = identifier.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ ok: false, error: 'An account with this email already exists' });
    }

    const code = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    activeOtps.set(email, {
      code,
      expiresAt,
      pendingData: { name, email, type, password, role: role || 'user', locality: locality || 'Indiranagar' }
    });

    console.log(`[OTP] Generated verification code for ${email}: ${code}`);

    res.json({
      ok: true,
      data: {
        success: true,
        message: 'Verification code dispatched successfully',
        identifier: email,
        devPreviewCode: code,
        delivery: { delivered: true, channel: type === 'phone' ? 'sms' : 'email' }
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/signup/verify-otp
router.post('/signup/verify-otp', async (req, res) => {
  try {
    const { identifier, code } = req.body;
    const email = (identifier || '').toLowerCase().trim();

    const otpData = activeOtps.get(email);
    if (!otpData) {
      return res.status(400).json({ ok: false, error: 'No pending OTP verification found or it has expired' });
    }

    if (Date.now() > otpData.expiresAt) {
      activeOtps.delete(email);
      return res.status(400).json({ ok: false, error: 'Verification code has expired. Please request a new one.' });
    }

    if (otpData.code !== (code || '').trim()) {
      return res.status(400).json({ ok: false, error: 'Invalid verification code. Please check and re-enter.' });
    }

    const { name, role, locality, password } = otpData.pendingData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'Password123!', salt);

    let providerId = null;
    if (role === 'provider') {
      providerId = 'sp-' + Math.random().toString(36).substring(2, 8);
    }

    const user = new User({
      name: name || 'Nexora User',
      email,
      phone: email.includes('@') ? '+91 98450 00000' : email,
      passwordHash,
      role: role || 'user',
      locality: locality || 'Indiranagar',
      providerId
    });

    await user.save();
    activeOtps.delete(email);

    // If provider, create profile in database
    if (role === 'provider' && providerId) {
      const profile = new ProviderProfile({
        id: providerId,
        userId: user._id,
        name: user.name,
        title: 'Specialist Service Provider',
        category: 'home-repairs',
        locality: user.locality,
        hourlyRate: 500,
        phone: user.phone,
        isVerified: true
      });
      await profile.save();
    }

    const token = generateToken(user);

    res.json({
      ok: true,
      data: {
        success: true,
        user: user.toJSON(),
        token,
        message: 'Account registered and verified successfully!'
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/signup (Direct password signup)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, role, locality } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ ok: false, error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let providerId = null;
    const requestedRole = (role === 'admin' ? 'user' : (role || 'user')); // prevent public admin creation
    if (requestedRole === 'provider') {
      providerId = 'sp-' + Math.random().toString(36).substring(2, 8);
    }

    const user = new User({
      name: name || 'Nexora User',
      email: normalizedEmail,
      phone: phone || '',
      passwordHash,
      role: requestedRole,
      locality: locality || 'Indiranagar',
      providerId
    });

    await user.save();

    if (requestedRole === 'provider' && providerId) {
      const profile = new ProviderProfile({
        id: providerId,
        userId: user._id,
        name: user.name,
        title: 'Specialist Service Provider',
        category: 'home-repairs',
        locality: user.locality,
        hourlyRate: 500,
        phone: user.phone,
        isVerified: true
      });
      await profile.save();
    }

    const token = generateToken(user);
    res.status(201).json({
      ok: true,
      data: {
        success: true,
        user: user.toJSON(),
        token
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/login/password
router.post('/login/password', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ ok: false, error: 'Please provide identifier and password' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier.trim() }]
    });

    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials. Please check your details.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ ok: false, error: 'Invalid credentials. Please check your password.' });
    }

    const token = generateToken(user);
    res.json({
      ok: true,
      data: {
        success: true,
        user: user.toJSON(),
        token,
        message: `Welcome back, ${user.name}!`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/login/request-otp
router.post('/login/request-otp', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ ok: false, error: 'Identifier is required' });
    }

    const cleanId = identifier.trim().toLowerCase();
    let user = await User.findOne({
      $or: [{ email: cleanId }, { phone: identifier.trim() }]
    });

    // Auto-create or seed if not exists during demo testing
    if (!user) {
      user = new User({
        name: cleanId.split('@')[0],
        email: cleanId.includes('@') ? cleanId : `${cleanId}@nexora.local`,
        phone: !cleanId.includes('@') ? cleanId : '+91 98450 00000',
        passwordHash: await bcrypt.hash('Password123!', 10),
        role: 'user',
        locality: 'Indiranagar'
      });
      await user.save();
    }

    const code = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    activeOtps.set(user.email, { code, expiresAt, userId: user._id });

    console.log(`[OTP] Login verification code for ${user.email}: ${code}`);

    res.json({
      ok: true,
      data: {
        success: true,
        message: 'Login OTP sent',
        devPreviewCode: code,
        identifier: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/login/verify-otp
router.post('/login/verify-otp', async (req, res) => {
  try {
    const { identifier, code } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();

    // Find in active OTPs
    let foundEmail = cleanId;
    let otpData = activeOtps.get(cleanId);

    if (!otpData) {
      // try looking up user by phone to get email key
      const user = await User.findOne({ phone: identifier.trim() });
      if (user) {
        foundEmail = user.email;
        otpData = activeOtps.get(user.email);
      }
    }

    if (!otpData) {
      return res.status(400).json({ ok: false, error: 'OTP expired or not found. Please request a new code.' });
    }

    if (otpData.code !== (code || '').trim()) {
      return res.status(400).json({ ok: false, error: 'Invalid verification code.' });
    }

    const user = await User.findById(otpData.userId);
    activeOtps.delete(foundEmail);

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const token = generateToken(user);
    res.json({
      ok: true,
      data: {
        success: true,
        user: user.toJSON(),
        token,
        message: `Authenticated successfully as ${user.name}!`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    ok: true,
    data: {
      success: true,
      user: req.user.toJSON()
    }
  });
});

// PATCH /api/auth/profile
router.patch('/profile', authMiddleware, async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'locality', 'address', 'avatar'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        req.user[key] = req.body[key];
      }
    }
    await req.user.save();
    res.json({
      ok: true,
      data: {
        success: true,
        user: req.user.toJSON(),
        message: 'Profile updated successfully'
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/addresses
router.post('/addresses', authMiddleware, async (req, res) => {
  try {
    const { label, address, isDefault } = req.body;
    if (!address) {
      return res.status(400).json({ ok: false, error: 'Address text is required' });
    }

    if (isDefault) {
      req.user.savedAddresses.forEach(a => a.isDefault = false);
    }

    req.user.savedAddresses.push({
      label: label || 'Home',
      address,
      isDefault: Boolean(isDefault)
    });

    await req.user.save();
    res.json({
      ok: true,
      data: {
        success: true,
        addresses: req.user.savedAddresses
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/switch-role
// Enables reliable switching between User, Provider, and Admin roles
router.post('/switch-role', authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'provider', 'admin'].includes(role)) {
      return res.status(400).json({ ok: false, error: 'Invalid role requested' });
    }

    req.user.role = role;

    // If switching to provider, ensure providerId is assigned and profile exists
    if (role === 'provider' && !req.user.providerId) {
      let profile = await ProviderProfile.findOne({
        $or: [{ userId: req.user._id }, { name: req.user.name }]
      });

      if (!profile) {
        const newId = 'sp-' + Math.random().toString(36).substring(2, 8);
        profile = new ProviderProfile({
          id: newId,
          userId: req.user._id,
          name: req.user.name,
          title: 'Specialist Service Provider',
          category: 'home-repairs',
          locality: req.user.locality,
          hourlyRate: 500,
          phone: req.user.phone,
          isVerified: true
        });
        await profile.save();
        req.user.providerId = newId;
      } else {
        req.user.providerId = profile.id;
        profile.userId = req.user._id;
        await profile.save();
      }
    }

    await req.user.save();

    const token = generateToken(req.user);

    res.json({
      ok: true,
      data: {
        success: true,
        user: req.user.toJSON(),
        token,
        role: req.user.role,
        message: `Switched view to ${role.toUpperCase()} mode`
      }
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    ok: true,
    data: {
      success: true,
      message: 'Logged out successfully'
    }
  });
});

export default router;
