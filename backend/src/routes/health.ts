import express from 'express';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * Health check endpoint
 * Critical for monitoring emergency system availability
 */
router.get('/', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      api: 'operational',
      database: 'checking...', // Will be updated with actual DB health check
      storage: 'checking...'   // Will be updated with actual storage health check
    }
  };

  logger.info('Health check requested', { 
    ip: req.ip, 
    userAgent: req.get('User-Agent') 
  });

  res.status(200).json(healthCheck);
});

/**
 * Detailed health check with service dependencies
 */
router.get('/detailed', async (req, res) => {
  try {
    const detailedHealth = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      },
      services: {
        api: {
          status: 'operational',
          responseTime: '< 10ms'
        },
        database: {
          status: 'checking',
          message: 'Database health check not implemented yet'
        },
        storage: {
          status: 'checking',
          message: 'Storage health check not implemented yet'
        }
      },
      safety_notice: 'For immediate emergencies, call 911. This API is for incident reporting and documentation.'
    };

    res.status(200).json(detailedHealth);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

export default router;