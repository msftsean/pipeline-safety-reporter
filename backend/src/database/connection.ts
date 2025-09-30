import { Pool, PoolConfig } from 'pg';
import { logger } from '../utils/logger';

// Database connection pool configuration
// Following Azure best practices with connection pooling
const poolConfig: PoolConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : false,
  
  // Connection pool settings for reliability
  max: 20, // Maximum number of connections
  min: 2,  // Minimum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Timeout connection attempts after 5 seconds
  
  // Query timeout for safety
  query_timeout: 10000, // 10 seconds max per query
  statement_timeout: 15000, // 15 seconds max per statement
};

// Create connection pool
export const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Database pool error:', err);
});

pool.on('connect', () => {
  logger.info('New database connection established');
});

pool.on('remove', () => {
  logger.info('Database connection removed from pool');
});

/**
 * Test database connection
 * Critical health check for emergency system
 */
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version()');
    client.release();
    
    logger.info('Database connection successful', {
      timestamp: result.rows[0]?.current_time,
      version: result.rows[0]?.version?.split(' ')[0] // Just PostgreSQL version
    });
    
    return true;
  } catch (error) {
    logger.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Execute a query with error handling and logging
 */
export async function query(text: string, params?: any[]): Promise<any> {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug('Database query executed', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      rows: result.rowCount
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    
    logger.error('Database query failed', {
      query: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      params: params ? '[REDACTED]' : 'none'
    });
    
    throw error;
  }
}

/**
 * Get a client from the pool for transactions
 */
export async function getClient() {
  return await pool.connect();
}

/**
 * Graceful shutdown of database connections
 */
export async function closePool(): Promise<void> {
  try {
    await pool.end();
    logger.info('Database connection pool closed');
  } catch (error) {
    logger.error('Error closing database pool:', error);
  }
}

// Initialize database connection test on startup
testConnection().catch((error) => {
  logger.error('Initial database connection test failed:', error);
  // Don't exit process here - let the app start and handle errors gracefully
});

export default pool;