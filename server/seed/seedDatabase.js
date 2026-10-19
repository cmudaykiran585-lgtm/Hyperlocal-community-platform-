import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from '../config/db.js';
import User from '../models/User.js';
import ProviderProfile from '../models/ProviderProfile.js';
import Booking from '../models/Booking.js';
import SupportTicket from '../models/SupportTicket.js';
import CommunityReport from '../models/CommunityReport.js';

export const seedDatabase = async () => {
  console.log('[Seed] Starting database synchronization and seeding...');

  // 1. Seed Core Role Users with bcrypt hashed passwords
  const passwordSalt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('Password123!', passwordSalt);

  const seedUsers = [
    {
      name: 'Aarav Sharma',
      email: 'user@nexora.local',
      phone: '+91 98451 99882',
      role: 'user',
      locality: 'Indiranagar',
      address: 'Flat 401, Palm Grove, 12th Main Road, Indiranagar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      savedAddresses: [
        { label: 'Home', address: 'Flat 401, Palm Grove, 12th Main Road, Indiranagar', isDefault: true },
        { label: 'Office', address: 'WeWork Galaxy, Residency Road, Bengaluru', isDefault: false }
      ],
      savedProviders: ['sp-rohit', 'sp-priya']
    },
    {
      name: 'Rohit Sharma (Provider)',
      email: 'provider@nexora.local',
      phone: '+91 98450 12345',
      role: 'provider',
      providerId: 'sp-rohit',
      locality: 'Indiranagar',
      address: 'Shop 14, 100 Feet Road, Indiranagar',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      savedAddresses: [
        { label: 'Workshop', address: 'Shop 14, 100 Feet Road, Indiranagar', isDefault: true }
      ]
    },
    {
      name: 'Platform Administrator',
      email: 'admin@nexora.local',
      phone: '+91 98000 00000',
      role: 'admin',
      locality: 'Bengaluru Central',
      address: 'MG Road Metro Boulevard, Bengaluru Central',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      savedAddresses: [
        { label: 'Headquarters', address: 'Nexora Core Operations Center, MG Road', isDefault: true }
      ]
    }
  ];

  const userMap = {};

  for (const u of seedUsers) {
    let existing = await User.findOne({ email: u.email });
    if (!existing) {
      existing = new User({
        ...u,
        passwordHash: defaultPasswordHash
      });
      await existing.save();
      console.log(`[Seed] Created user: ${u.email} (${u.role})`);
    } else {
      existing.role = u.role;
      existing.providerId = u.providerId || existing.providerId;
      await existing.save();
    }
    userMap[u.email] = existing;
  }

  // 2. Seed Verified Provider Profiles
  const seedProviders = [
    {
      id: 'sp-rohit',
      name: 'Rohit Sharma',
      title: 'Licensed Electrician & Home Repair Pro',
      category: 'work-repair',
      locality: 'Indiranagar',
      hourlyRate: 350,
      rating: 4.9,
      reviewsCount: 142,
      experienceYears: 8,
      isVerified: true,
      verificationStatus: 'approved',
      verificationBadge: 'Government ID & Guild Verified',
      image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98450 12345',
      bio: 'Certified master electrician with 8+ years experience handling home power backups, tripping lines, smart home lighting, and complete distribution boards.',
      skills: ['MCB Tripping Diagnosis', 'Inverter Wiring', 'Ceiling Fan Installation', 'Smart Switches', 'Wiring Inspection'],
      servicesOffered: [
        { id: 's1', title: 'Emergency Inspection & Short Circuit Fix', duration: '1 Hour', price: 350, desc: 'Troubleshoot tripping circuit breakers, burning smells, and socket fault diagnosis.' },
        { id: 's2', title: 'Complete Switchboard & Inverter Wiring', duration: '2 Hours', price: 650, desc: 'Clean installation of heavy-duty appliance points, inverters, and surge protectors.' },
        { id: 's3', title: 'Full Day Home Electrical Overhaul', duration: '8 Hours', price: 2400, desc: 'Dedicated full day inspection, rewiring, and modern fixtures installation.' }
      ],
      timeSlots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:30 PM'],
      isInPersonAvailable: true,
      isOnlineAvailable: false,
      availabilityText: 'Today: 2 Slots Open',
      workingHours: 'Mon - Sat: 8:00 AM - 8:00 PM',
      coordinates: { lat: 12.9716, lng: 77.6412 }
    },
    {
      id: 'sp-priya',
      name: 'Priya Sundaram',
      title: 'Class 9-12 CBSE Maths & Science Tutor',
      category: 'guidance-learning',
      locality: 'Koramangala',
      hourlyRate: 450,
      rating: 4.95,
      reviewsCount: 88,
      experienceYears: 6,
      isVerified: true,
      verificationStatus: 'approved',
      verificationBadge: 'Academic Credentials Verified',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98450 67890',
      bio: 'B.Tech gold medalist specializing in high-school board prep, conceptual physics, calculus, and board exam mock papers.',
      skills: ['CBSE Curriculum', 'Calculus', 'Thermodynamics', 'Board Exam Strategies', 'Doubt Clearing'],
      servicesOffered: [
        { id: 's4', title: '1-on-1 Concept Foundation Session', duration: '1 Hour', price: 450, desc: 'Targeted chapter breakdown with interactive problem solving.' },
        { id: 's5', title: 'Intensive Weekly Mock & Doubt Buster', duration: '2 Hours', price: 800, desc: 'Detailed past-year question paper review and mistake analysis.' }
      ],
      timeSlots: ['10:00 AM', '02:00 PM', '05:00 PM', '07:30 PM'],
      isInPersonAvailable: true,
      isOnlineAvailable: true,
      availabilityText: 'Tomorrow: 3 Slots Open',
      workingHours: 'Mon - Sun: 9:00 AM - 8:30 PM',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    {
      id: 'sp-arjun',
      name: 'Arjun Gowda',
      title: 'Two-Wheeler & EV Mechanic (Doorstep)',
      category: 'work-repair',
      locality: 'Indiranagar',
      hourlyRate: 300,
      rating: 4.82,
      reviewsCount: 65,
      experienceYears: 5,
      isVerified: true,
      verificationStatus: 'approved',
      verificationBadge: 'Automotive Guild Certified',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98451 11223',
      bio: 'Doorstep bike breakdowns, brake repairs, oil services, and battery diagnostics for petrol & electric scooters.',
      skills: ['Brake Bleeding', 'EV Battery Health', 'Carburetor Tuning', 'Drive Belt Replacement', 'Puncture Repair'],
      servicesOffered: [
        { id: 's6', title: 'General Service & Brake Tune-up', duration: '2 Hours', price: 550, desc: 'Engine oil replacement, brake pad tuning, throttle adjustment, wash and polish.' }
      ],
      timeSlots: ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'],
      isInPersonAvailable: true,
      isOnlineAvailable: false,
      availabilityText: 'Today: 1 Slot Open',
      workingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      coordinates: { lat: 12.9784, lng: 77.6408 }
    },
    {
      id: 'sp-neha',
      name: 'Neha Kapoor',
      title: 'Personal Assistant & Senior Escort',
      category: 'companionship',
      locality: 'Indiranagar',
      hourlyRate: 400,
      rating: 4.96,
      reviewsCount: 114,
      experienceYears: 4,
      isVerified: true,
      verificationStatus: 'approved',
      verificationBadge: 'Caregiver & Background Verified',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98452 33445',
      bio: 'Patient, warm companion for clinic visits, park walks, grocery planning, and official document submissions.',
      skills: ['Hospital Queue Navigation', 'Prescription Management', 'Empathetic Listening', 'Tech Setup for Seniors'],
      servicesOffered: [
        { id: 's7', title: 'Hospital Visit & Token Queue Escort', duration: '3 Hours', price: 1100, desc: 'Accompanying elderly patients, collecting OPD tokens, taking doctor notes, and pharmacy dispatch.' },
        { id: 's8', title: 'Half Day Senior Companionship Walk', duration: '4 Hours', price: 1400, desc: 'Engaging conversations, outdoor walking support, and daily routine assistance.' }
      ],
      timeSlots: ['08:00 AM', '11:00 AM', '02:30 PM', '05:30 PM'],
      isInPersonAvailable: true,
      isOnlineAvailable: false,
      availabilityText: 'Today: 2 Slots Open',
      workingHours: 'Mon - Sun: 7:30 AM - 8:00 PM',
      coordinates: { lat: 12.9719, lng: 77.6380 }
    },
    {
      id: 'sp-sid',
      name: 'Siddharth Iyer',
      title: 'Principal Software Architect & Mentor',
      category: 'remote-experts',
      locality: 'Whitefield',
      hourlyRate: 1200,
      rating: 4.98,
      reviewsCount: 76,
      experienceYears: 12,
      isVerified: true,
      verificationStatus: 'approved',
      verificationBadge: 'Top Industry Expert',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98453 55667',
      bio: 'Staff engineer at tier-1 cloud company. 1-on-1 system design reviews, live code debugging, and mock technical interviews.',
      skills: ['Distributed Systems', 'Go / Node.js', 'System Design', 'Kafka & Redis', 'Kubernetes'],
      servicesOffered: [
        { id: 's9', title: 'System Design & Architecture Critique', duration: '1 Hour', price: 1200, desc: 'Deep dive into your scalable microservices design, latency bottlenecks, and DB choices.' },
        { id: 's10', title: 'Live Code Debugging & Refactoring', duration: '1 Hour', price: 1200, desc: 'Hands-on debugging of concurrency, memory leaks, and production bugs.' }
      ],
      timeSlots: ['06:00 PM', '07:30 PM', '09:00 PM'],
      isInPersonAvailable: false,
      isOnlineAvailable: true,
      availabilityText: 'Tonight: 2 Slots Open',
      workingHours: 'Mon - Fri: 6:00 PM - 10:00 PM',
      coordinates: { lat: 12.9698, lng: 77.7499 }
    }
  ];

  for (const p of seedProviders) {
    let existing = await ProviderProfile.findOne({ id: p.id });
    if (!existing) {
      const doc = new ProviderProfile(p);
      if (p.id === 'sp-rohit' && userMap['provider@nexora.local']) {
        doc.userId = userMap['provider@nexora.local']._id;
      }
      await doc.save();
      console.log(`[Seed] Created provider profile: ${p.name} (#${p.id})`);
    } else {
      existing.hourlyRate = p.hourlyRate;
      existing.isVerified = p.isVerified;
      existing.servicesOffered = p.servicesOffered;
      await existing.save();
    }
  }

  // 3. Seed Initial Bookings
  const seedBookings = [
    {
      id: 'NX-89421',
      userId: userMap['user@nexora.local']?._id.toString() || 'u-101',
      customerId: userMap['user@nexora.local']?._id || null,
      userName: 'Aarav Sharma',
      providerId: 'sp-rohit',
      providerName: 'Rohit Sharma',
      providerTitle: 'Licensed Electrician & Home Repair Pro',
      serviceTitle: 'Emergency Inspection & Short Circuit Fix',
      category: 'work-repair',
      date: 'Tomorrow',
      timeSlot: '02:00 PM',
      mode: 'in-person',
      locality: 'Indiranagar',
      address: 'Flat 401, Palm Grove, 12th Main Road, Indiranagar',
      notes: 'Master bedroom main switch trips whenever AC is turned on.',
      price: 350,
      phone: '+91 98450 12345',
      status: 'Confirmed'
    },
    {
      id: 'NX-77209',
      userId: userMap['user@nexora.local']?._id.toString() || 'u-101',
      customerId: userMap['user@nexora.local']?._id || null,
      userName: 'Aarav Sharma',
      providerId: 'sp-priya',
      providerName: 'Priya Sundaram',
      providerTitle: 'Class 9-12 CBSE Maths & Science Tutor',
      serviceTitle: '1-on-1 Concept Foundation Session',
      category: 'guidance-learning',
      date: 'Oct 24, 2026',
      timeSlot: '05:00 PM',
      mode: 'remote',
      locality: 'Koramangala',
      address: 'Online Session (Google Meet link provided)',
      notes: 'Need revision on Trigonometric Identities and Calculus limits.',
      price: 450,
      phone: '+91 98450 67890',
      status: 'In-Progress'
    },
    {
      id: 'NX-61045',
      userId: userMap['user@nexora.local']?._id.toString() || 'u-101',
      customerId: userMap['user@nexora.local']?._id || null,
      userName: 'Aarav Sharma',
      providerId: 'sp-neha',
      providerName: 'Neha Kapoor',
      providerTitle: 'Personal Assistant & Senior Escort',
      serviceTitle: 'Hospital Visit & Token Queue Escort',
      category: 'companionship',
      date: 'Oct 15, 2026',
      timeSlot: '08:30 AM',
      mode: 'in-person',
      locality: 'Indiranagar',
      address: 'Manipal Hospital, Old Airport Road',
      notes: 'Cardiology routine consult escort for grandfather.',
      price: 1100,
      phone: '+91 98452 33445',
      status: 'Completed',
      paymentStatus: 'Paid'
    }
  ];

  for (const b of seedBookings) {
    const existing = await Booking.findOne({ id: b.id });
    if (!existing) {
      await new Booking(b).save();
      console.log(`[Seed] Created booking #${b.id} for ${b.providerName}`);
    }
  }

  // 4. Seed Support Tickets
  const existingTicket = await SupportTicket.findOne({ id: 'NX-TICKET-101' });
  if (!existingTicket) {
    await new SupportTicket({
      id: 'NX-TICKET-101',
      userName: 'Aarav Sharma',
      userEmail: 'user@nexora.local',
      subject: 'Inquiry regarding doorstep warranty guarantee',
      category: 'Service Guarantee',
      message: 'Does Nexora provide a 30-day warranty on parts replaced by certified electricians?',
      status: 'Open',
      priority: 'Medium'
    }).save();
    console.log('[Seed] Created seed support ticket #NX-TICKET-101');
  }

  // 5. Seed Community Civic Reports
  const existingReport = await CommunityReport.findOne({ id: 'rep-seed-1' });
  if (!existingReport) {
    await new CommunityReport({
      id: 'rep-seed-1',
      title: 'Open transformer panel near 12th Main Indiranagar park',
      category: 'Electrical Safety',
      locality: 'Indiranagar',
      address: 'Near 12th Main Road BBMP Park entrance',
      description: 'High voltage junction box cover is ajar, dangerous during monsoon rains.',
      upvotes: 42,
      status: 'Verified & In Progress',
      history: [
        { status: 'Under Review', note: 'Reported by local resident' },
        { status: 'Verified & In Progress', note: 'Forwarded to BESCOM Ward 112 electrical engineer' }
      ]
    }).save();
    console.log('[Seed] Created seed civic report #rep-seed-1');
  }

  console.log('[Seed] Database initialization and seeding completed successfully!');
};

// Allow standalone execution: node server/seed/seedDatabase.js
if (process.argv[1] && process.argv[1].includes('seedDatabase.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[Seed] Error during seeding:', err);
      process.exit(1);
    }
  })();
}
