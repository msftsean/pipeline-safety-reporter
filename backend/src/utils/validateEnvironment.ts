import { logger } from './logger';

/**
 * Validates required environment variables for the application
 * Following safety-first principle - fail fast if critical config is missing
 */
export function validateEnvironment(): void {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  const optionalVars = [
    'AZURE_STORAGE_ACCOUNT_NAME',
    'AZURE_STORAGE_CONTAINER_NAME'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    logger.error('❌ Missing required environment variables:', { missing });
    logger.error('💡 Copy .env.example to .env and configure the required values');
    process.exit(1);
  }

  // Warn about missing optional variables
  const missingOptional = optionalVars.filter(varName => !process.env[varName]);
  if (missingOptional.length > 0) {
    logger.warn('⚠️ Missing optional environment variables (some features may be disabled):', { missingOptional });
  }

  // Validate specific values
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.error('❌ JWT_SECRET must be at least 32 characters long for security');
    process.exit(1);
  }

  const port = parseInt(process.env.PORT || '3001');
  if (isNaN(port) || port < 1 || port > 65535) {
    logger.error('❌ PORT must be a valid port number (1-65535)');
    process.exit(1);
  }

  logger.info('✅ Environment validation passed');
}