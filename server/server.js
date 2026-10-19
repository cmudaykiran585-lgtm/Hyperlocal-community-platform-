import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { seedDatabase } from './seed/seedDatabase.js';

import authRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import supportRoutes from './routes/supportRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const allowedOrigins = (process.env.FRONTEND_URL || 'https://nexora-live.surge.sh,http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost') || origin.includes('surge.sh')) {
      return callback(null, true);
    }
    return callback(null, true); // permissive for student project demo
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for visibility during testing and presentation
app.use((req, res, next) => {
  console.log(`[HTTP ${req.method}] ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    data: {
      status: 'healthy',
      service: 'NEXORA Hyperlocal Platform Backend API',
      database: 'MongoDB (Mongoose)',
      timestamp: new Date().toISOString()
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);

// Backward-compatible fallback for community reports
app.use('/api/community', supportRoutes);

// 404 Handler for unrecognized API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: `API route not found: [${req.method}] ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    error: err.message || 'Internal server error occurred',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

// Server Initialization
export const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 NEXORA Backend Server running on port ${PORT}`);
      console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
      console.log(`🗄️  MongoDB: Connected & Seeded with User/Provider/Admin Data`);
      console.log(`======================================================\n`);
    });

    return { app, server };
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

// Auto-start when executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer();
}

export default app;
