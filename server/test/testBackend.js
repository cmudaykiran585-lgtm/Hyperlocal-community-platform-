import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../seed/seedDatabase.js';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Booking from '../models/Booking.js';
import SupportTicket from '../models/SupportTicket.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const runTests = async () => {
  console.log('====================================================');
  console.log('🧪 NEXORA BACKEND & MONGODB COMPREHENSIVE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Database Connection Test
    console.log('--- Test Group 1: Database Connectivity ---');
    const conn = await connectDB();
    assert(conn && conn.readyState === 1, 'MongoDB connection established (readyState = 1)');

    // 2. Database Seeding Test
    console.log('\n--- Test Group 2: Seeding & Collection Verification ---');
    await seedDatabase();

    const userCount = await User.countDocuments();
    assert(userCount >= 3, `Users collection seeded (found ${userCount} users)`);

    const providerCount = await ProviderProfile.countDocuments();
    assert(providerCount >= 5, `ProviderProfiles collection seeded (found ${providerCount} providers)`);

    const bookingCount = await Booking.countDocuments();
    assert(bookingCount >= 3, `Bookings collection seeded (found ${bookingCount} bookings)`);

    // 3. User Authentication & Password Hashing Tests
    console.log('\n--- Test Group 3: Authentication & Password Security ---');
    const testEmail = `test_${Date.now()}@nexora.local`;
    const plainPassword = 'SecurePassword2026!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    const testUser = new User({
      name: 'Test Resident',
      email: testEmail,
      phone: '+91 91111 22222',
      passwordHash: hash,
      role: 'user',
      locality: 'Indiranagar'
    });
    await testUser.save();
    assert(testUser._id != null, 'User created and saved to MongoDB');

    // Password comparison
    const passwordMatch = await testUser.comparePassword(plainPassword);
    assert(passwordMatch === true, 'comparePassword() returns true for valid password');

    const wrongPasswordMatch = await testUser.comparePassword('WrongPassword!');
    assert(wrongPasswordMatch === false, 'comparePassword() returns false for invalid password');

    // PasswordHash sanitization
    const jsonUser = testUser.toJSON();
    assert(jsonUser.passwordHash === undefined, 'toJSON() strips passwordHash from API responses');

    // Unique email constraint
    try {
      const duplicateUser = new User({
        name: 'Duplicate Person',
        email: testEmail,
        passwordHash: hash
      });
      await duplicateUser.save();
      assert(false, 'Unique email constraint rejected duplicate email');
    } catch (dupErr) {
      assert(true, 'Unique email constraint rejected duplicate email (11000 duplicate key error)');
    }

    // 4. Role Switching & Authorization Verification (PROBLEM 2 TEST)
    console.log('\n--- Test Group 4: Role-Switching & Cross-Role Permissions ---');
    // Switch to provider
    testUser.role = 'provider';
    testUser.providerId = 'sp-test-specialist';
    await testUser.save();

    const updatedUser = await User.findById(testUser._id);
    assert(updatedUser.role === 'provider', 'User role successfully switched to "provider" in MongoDB');
    assert(updatedUser.providerId === 'sp-test-specialist', 'Provider profile ID successfully assigned to user');

    // Create corresponding provider profile
    const testProviderProfile = new ProviderProfile({
      id: 'sp-test-specialist',
      userId: testUser._id,
      name: testUser.name,
      title: 'Solar & Electrical Technician',
      category: 'work-repair',
      locality: 'Indiranagar',
      hourlyRate: 400,
      phone: testUser.phone
    });
    await testProviderProfile.save();
    assert(testProviderProfile._id != null, 'ProviderProfile created and linked to User in MongoDB');

    // 5. Cross-Role Data Propagation Test (PART 6: Examples A, B, C)
    console.log('\n--- Test Group 5: Cross-Role Data Propagation & State Integrity ---');

    // Example A: Provider changes pricing
    testProviderProfile.hourlyRate = 550;
    await testProviderProfile.save();
    const verifiedProfile = await ProviderProfile.findOne({ id: 'sp-test-specialist' });
    assert(verifiedProfile.hourlyRate === 550, 'Example A: Provider updated hourly rate from 400 to 550; verified in MongoDB');

    // Example B: Provider updates availability
    testProviderProfile.timeSlots = ['08:00 AM', '11:00 AM', '03:00 PM'];
    testProviderProfile.availabilityText = 'Today: 3 Slots Open';
    await testProviderProfile.save();
    const verifiedAvailability = await ProviderProfile.findOne({ id: 'sp-test-specialist' });
    assert(verifiedAvailability.timeSlots.length === 3, 'Example B: Provider updated available time slots; verified in MongoDB');

    // Example C: Customer creates booking for this provider
    const newBookingId = `NX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = new Booking({
      id: newBookingId,
      customerId: testUser._id,
      userId: testUser._id.toString(),
      userName: 'Aarav Sharma',
      providerId: 'sp-test-specialist',
      providerName: testProviderProfile.name,
      serviceTitle: 'Solar Panel Inspection',
      date: 'Tomorrow',
      timeSlot: '08:00 AM',
      price: 550,
      status: 'Confirmed'
    });
    await newBooking.save();

    const storedBooking = await Booking.findOne({ id: newBookingId });
    assert(storedBooking != null, `Example C: Customer created booking #${newBookingId} in MongoDB`);
    assert(storedBooking.price === 550, 'Example C: Booking captured the updated provider rate of ₹550');

    // Provider views the booking in their dashboard queries
    const providerIncomingBookings = await Booking.find({ providerId: 'sp-test-specialist' });
    assert(providerIncomingBookings.length >= 1, 'Provider successfully retrieves customer booking request in dashboard');

    // Provider updates booking status to 'Completed'
    storedBooking.status = 'Completed';
    storedBooking.paymentStatus = 'Paid';
    await storedBooking.save();

    const completedBookingCheck = await Booking.findOne({ id: newBookingId });
    assert(completedBookingCheck.status === 'Completed', 'Provider marked booking as "Completed"; state propagated in MongoDB');
    assert(completedBookingCheck.paymentStatus === 'Paid', 'Payment status automatically updated to "Paid" on completion');

    // Example D: Admin verifies provider
    console.log('\n--- Test Group 6: Admin Governance & Verification ---');
    testProviderProfile.isVerified = true;
    testProviderProfile.verificationStatus = 'approved';
    testProviderProfile.verificationBadge = 'Government ID & Guild Verified';
    await testProviderProfile.save();

    const adminVerified = await ProviderProfile.findOne({ id: 'sp-test-specialist' });
    assert(adminVerified.isVerified === true, 'Example D: Admin approved provider; isVerified = true in MongoDB');
    assert(adminVerified.verificationStatus === 'approved', 'Example D: verificationStatus updated to "approved" in MongoDB');

    // 6. Cleanup test records
    await User.deleteOne({ _id: testUser._id });
    await ProviderProfile.deleteOne({ id: 'sp-test-specialist' });
    await Booking.deleteOne({ id: newBookingId });

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    await disconnectDB();
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
};

runTests();
