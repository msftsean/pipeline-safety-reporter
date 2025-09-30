import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { validateEnvironment } from './utils/validateEnvironment';
import reportsRouter from './routes/reports';
import healthRouter from './routes/health';

// Load environment variables
dotenv.config();

// Validate required environment variables (skip database for demo)
// validateEnvironment();

const app = express();
const PORT = process.env.PORT || 3001;

// Security-first middleware configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration for frontend access
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting for emergency reporting balance
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks
  skip: (req) => req.path === '/api/health'
});

app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Health check endpoint (no auth required)
app.use('/api/health', healthRouter);

// API routes
app.use('/api/reports', reportsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Pipeline Safety Reporter API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      reports: '/api/reports'
    },
    safety_notice: 'For immediate emergencies, call 911. This system is for safety incident reporting and documentation.'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: ['/api/health', '/api/reports']
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  // Add cleanup logic here (close DB connections, etc.)
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Starting graceful shutdown...');
  // Add cleanup logic here
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚨 Pipeline Safety Reporter API running on port ${PORT}`);
  logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🛡️ Security: Rate limiting enabled (${process.env.RATE_LIMIT_MAX_REQUESTS} req/15min)`);
  logger.info(`⚡ Ready for emergency pipeline safety reports`);
});

export default app;