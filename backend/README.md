# Pipeline Safety Reporter - Backend API

🚨 **Emergency pipeline safety reporting system backend**

This is the Node.js/Express backend API that powers the Pipeline Safety Reporter application, following safety-first development principles.

## 🏗️ Architecture

- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js with security middleware
- **Database:** PostgreSQL 15+ with PostGIS extension
- **Storage:** Azure Blob Storage for photo uploads
- **Authentication:** JWT for admin functions (no auth for public reporting)
- **Security:** Rate limiting, input validation, CORS, Helmet

## 🚀 Quick Start

### Prerequisites

```bash
# Required
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
psql --version  # PostgreSQL 15+ with PostGIS

# Optional (for photo uploads)
# Azure Storage Account
```

### Installation

```bash
# Clone and navigate to backend
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Setup database
# 1. Create PostgreSQL database
createdb pipeline_safety_reporter

# 2. Run schema migration
npm run db:migrate

# 3. Optional: Add sample data
npm run db:seed
```

### Environment Configuration

Create `.env` file with these variables:

```env
# Application
NODE_ENV=development
PORT=3001

# Database (Required)
DATABASE_URL=postgresql://username:password@localhost:5432/pipeline_safety_reporter
POSTGRES_SSL=false

# Security (Required)  
JWT_SECRET=your_super_secure_jwt_secret_change_in_production

# Azure Storage (Optional - for photo uploads)
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
AZURE_STORAGE_CONTAINER_NAME=pipeline-photos

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
MAX_FILES_PER_REPORT=5
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint and format code
npm run lint
npm run format
```

## 📚 API Endpoints

### Public Endpoints (No Authentication)

#### Health Check
```http
GET /api/health
GET /api/health/detailed
```

#### Report Submission
```http
POST /api/reports
Content-Type: application/json

{
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "New York, NY"
  },
  "problemCategory": "gas_leak_odor",
  "severityLevel": "high",
  "description": "Strong gas odor detected near pipeline marker",
  "weatherConditions": "clear",
  "contactInfo": "optional-contact@example.com",
  "photos": ["base64-encoded-image-data"]
}
```

#### Report Retrieval
```http
GET /api/reports?lat=40.7128&lng=-74.0060&radius=10&limit=50
GET /api/reports/:id
```

### Admin Endpoints (Authentication Required)
*Coming in Phase 2*

## 🗄️ Database Schema

### Core Tables

- **`reports`** - Main pipeline safety reports with geospatial data
- **`admin_users`** - Admin user accounts for review dashboard
- **Custom Types:** `problem_category`, `severity_level`, `report_status`

### Key Features

- **PostGIS Integration** - Geospatial queries and indexing
- **Audit Trail** - Created/updated timestamps, IP logging
- **Data Validation** - Constraints and triggers for data integrity
- **Performance** - Optimized indexes for emergency response speed

## 🔒 Security Features

### Input Security
- **Joi Validation** - All request data validated
- **SQL Injection Protection** - Parameterized queries only
- **XSS Prevention** - Input sanitization
- **File Upload Security** - Type validation, malware scanning

### Network Security
- **HTTPS Only** - TLS encryption required
- **CORS Configuration** - Controlled cross-origin access
- **Rate Limiting** - Prevent abuse while allowing emergency reports
- **Security Headers** - Helmet.js security middleware

### Data Protection
- **Anonymous by Design** - No PII collection without consent
- **Photo Metadata Stripping** - Privacy protection
- **Encrypted Contact Info** - When provided voluntarily
- **Audit Logging** - Security event tracking

## 📊 Monitoring & Logging

### Log Levels
- **Error** - System errors, security events
- **Warn** - Performance issues, missing optional config
- **Info** - Request logging, health checks
- **Debug** - Development debugging (dev only)

### Log Files
- `logs/error.log` - Error-level events
- `logs/combined.log` - All log levels
- Console output in development

### Health Monitoring
```bash
# Check API health
curl http://localhost:3001/api/health

# Detailed health with system info
curl http://localhost:3001/api/health/detailed
```

## 🧪 Testing

### Test Categories
- **Unit Tests** - Individual function testing
- **Integration Tests** - API endpoint testing
- **Security Tests** - Input validation, auth testing
- **Performance Tests** - Load testing for emergency scenarios

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] SSL certificates installed
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Monitoring set up
- [ ] Log rotation configured
- [ ] Backup procedures tested

### Azure Deployment

```bash
# Build for production
npm run build

# Deploy to Azure App Service
# (Configure CI/CD pipeline in GitHub Actions)
```

### Database Migration

```bash
# Production database setup
npm run db:migrate

# Verify schema
psql $DATABASE_URL -c "\d reports"
```

## 🔧 Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for admin JWT tokens | `your-256-bit-secret` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `LOG_LEVEL` | Logging level | `info` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `MAX_FILE_SIZE` | Max photo size in bytes | `5242880` (5MB) |

## 🐛 Troubleshooting

### Common Issues

**Database Connection Fails**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection string
psql $DATABASE_URL -c "SELECT version();"
```

**PostGIS Extension Missing**
```sql
-- Connect to your database and run:
CREATE EXTENSION IF NOT EXISTS postgis;
```

**Photo Upload Fails**
- Check Azure Storage configuration
- Verify file size limits
- Check network connectivity

### Debug Mode

```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev

# Check specific logs
tail -f logs/error.log
tail -f logs/combined.log
```

## 📈 Performance

### Optimization Features
- **Connection Pooling** - Database connection reuse
- **Query Optimization** - Indexed geospatial queries
- **Compression** - Gzip response compression
- **Caching** - Response caching where appropriate

### Performance Targets
- **Response Time** < 200ms for health checks
- **Report Submission** < 1s including photo upload
- **Database Queries** < 100ms for geospatial searches
- **Concurrent Users** 1000+ simultaneous reporters

## 🤝 Contributing

1. Follow the [project constitution](../CONSTITUTION.md)
2. Ensure all safety-critical functions have >90% test coverage
3. Run security and performance tests
4. Update documentation for API changes

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

---

🚨 **Built for emergency pipeline safety reporting - every millisecond matters**