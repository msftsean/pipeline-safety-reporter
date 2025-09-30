# Pipeline Safety Reporter

🚨 **Emergency pipeline safety reporting system for community-driven incident detection and response**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](https://github.com/msftsean/pipeline-safety-reporter)
[![Build Status](https://img.shields.io/badge/Build-In%20Development-orange.svg)](https://github.com/msftsean/pipeline-safety-reporter)

## 🎯 Mission

Enable rapid, anonymous reporting of pipeline safety concerns through a mobile-first web application that prioritizes emergency response and community safety.

## 🚀 Key Features

- **🔒 Anonymous Reporting** - No registration required for emergency reports
- **📱 Mobile-First Design** - Optimized for emergency use on mobile devices
- **📍 GPS Location Capture** - Automatic location detection with manual adjustment
- **📸 Photo Evidence** - Multi-photo upload with compression and security
- **🗺️ Interactive Mapping** - Real-time display of safety reports with clustering
- **⚡ Emergency-Focused UX** - Fast, stress-free reporting workflow
- **🛡️ Privacy-First** - GDPR compliant with data minimization principles

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for responsive design
- Mapbox GL JS for interactive maps
- Vite for fast development builds

**Backend:**
- Node.js with Express and TypeScript
- PostgreSQL with PostGIS for geospatial data
- Azure Blob Storage for secure photo storage
- JWT authentication for admin functions

**Infrastructure:**
- Azure App Service for hosting
- Azure Database for PostgreSQL
- Azure Blob Storage with CDN
- GitHub Actions for CI/CD

## 📋 Project Structure

```
pipeline-safety-reporter/
├── backend/              # Node.js/Express API server
├── frontend/             # React web application
├── docs/                # Additional documentation
├── .github/             # GitHub workflows and templates
├── .specify/            # Spec-driven development framework
├── CONSTITUTION.md      # Project development principles
├── SPECIFICATION.md     # Complete product requirements
├── IMPLEMENTATION_PLAN.md # Development roadmap
├── DEVELOPMENT_TASKS.md # Sprint tasks and acceptance criteria
└── README.md           # This file
```

## 🏛️ Core Principles

This project follows a **Safety-First Development** approach with these non-negotiable principles:

1. **Safety-First Development** - Emergency functionality takes absolute precedence
2. **Anonymous-by-Design** - User privacy and anonymity are fundamental rights
3. **Mobile-First Emergency UX** - Must work flawlessly during emergency situations
4. **Zero-Barrier Reporting** - No registration or account creation required
5. **Geographic Data Integrity** - Location accuracy is critical for emergency response

*See [CONSTITUTION.md](CONSTITUTION.md) for complete development principles.*

## 📖 User Journey

### For Emergency Reporters

1. **Detect Issue** - Notice pipeline safety concern (smell, damage, etc.)
2. **Open App** - Access web app on mobile device or computer
3. **Report Quickly** - Fill emergency-style form with:
   - Auto-captured GPS location
   - Photos of the issue
   - Problem category and severity
   - Brief description
4. **Submit Anonymously** - No account needed
5. **View Map** - See other reports in the area

### For Pipeline Operators

1. **Review Reports** - Access admin dashboard
2. **Assess Priority** - Evaluate severity and location
3. **Take Action** - Dispatch teams or coordinate response
4. **Update Status** - Mark reports as under review or resolved

## 🛠️ Development Status

| Phase | Status | Timeline | Description |
|-------|--------|----------|-------------|
| **Phase 1: Foundation** | 🟡 In Progress | Weeks 1-4 | Core API, database, basic reporting form |
| **Phase 2: Enhancement** | ⏳ Planned | Weeks 5-8 | Interactive maps, admin dashboard, mobile optimization |
| **Phase 3: Launch** | ⏳ Planned | Weeks 9-12 | Security hardening, testing, production deployment |

### Current Sprint: Foundation Setup

- [x] Project constitution and specifications
- [x] Development framework setup
- [ ] Backend API foundation
- [ ] Database schema implementation
- [ ] Basic report submission
- [ ] Photo upload system

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 15+ with PostGIS extension
- Azure account for storage services
- Git for version control

### Development Setup

```bash
# Clone the repository
git clone https://github.com/msftsean/pipeline-safety-reporter.git
cd pipeline-safety-reporter

# Setup backend
cd backend
npm install
cp .env.example .env
# Configure environment variables
npm run dev

# Setup frontend (in new terminal)
cd ../frontend
npm install
npm run dev
```

### Environment Configuration

Create `.env` files in both backend and frontend directories:

**Backend `.env`:**
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pipeline_safety
POSTGRES_SSL=false

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account
AZURE_STORAGE_CONTAINER_NAME=pipeline-photos

# Application
NODE_ENV=development
PORT=3001
JWT_SECRET=your_jwt_secret_for_admin_auth
```

**Frontend `.env`:**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token

# Application
VITE_APP_NAME=Pipeline Safety Reporter
VITE_APP_VERSION=1.0.0
```

## 📚 Documentation

- **[Constitution](CONSTITUTION.md)** - Development principles and governance
- **[Specification](SPECIFICATION.md)** - Complete product requirements
- **[Implementation Plan](IMPLEMENTATION_PLAN.md)** - 12-week development roadmap
- **[Development Tasks](DEVELOPMENT_TASKS.md)** - Sprint tasks and acceptance criteria
- **[API Documentation](docs/API.md)** - Backend API reference *(coming soon)*
- **[User Guide](docs/USER_GUIDE.md)** - End-user documentation *(coming soon)*

## 🤝 Contributing

This project uses **Spec-Driven Development** principles. All contributions must:

1. Align with the project [Constitution](CONSTITUTION.md)
2. Follow safety-first development practices  
3. Maintain anonymous-by-design architecture
4. Pass all security and performance requirements
5. Include appropriate tests and documentation

### Development Workflow

1. Review the [Development Tasks](DEVELOPMENT_TASKS.md)
2. Create feature branch: `git checkout -b feature/task-name`
3. Implement following constitutional principles
4. Add tests and ensure >90% coverage for safety-critical functions
5. Submit PR with compliance statement
6. Pass code review and automated testing

## 🔒 Security

Security is paramount for this emergency reporting system:

- **Data Protection** - All transmissions use HTTPS with proper validation
- **Privacy First** - Minimal data collection, anonymous by default
- **Input Validation** - Comprehensive sanitization of all user inputs
- **File Security** - Photo uploads scanned and metadata stripped
- **Rate Limiting** - Prevent abuse while allowing legitimate emergency reports

Report security vulnerabilities to: [security@pipeline-safety-reporter.com](mailto:security@pipeline-safety-reporter.com)

## 📈 Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Page Load Time | < 3s on 3G | TBD | 🟡 In Development |
| Report Submission | < 1s feedback | TBD | 🟡 In Development |
| System Uptime | > 99.5% | TBD | 🟡 In Development |
| Mobile Usage | > 70% traffic | TBD | 🟡 In Development |

## 🚨 Emergency Use

This application is designed for **emergency pipeline safety reporting**. If you encounter an immediate safety threat:

1. **Call 911** for immediate emergencies
2. **Evacuate** the area if you smell gas or see active leaks
3. **Report** through this app for documentation and follow-up
4. **Contact** your local pipeline operator emergency line

**This app supplements but does not replace emergency services.**

## 📱 Browser Support

| Browser | Mobile | Desktop | Status |
|---------|--------|---------|--------|
| Chrome | ✅ 90+ | ✅ 90+ | Full Support |
| Safari | ✅ 14+ | ✅ 14+ | Full Support |
| Firefox | ✅ 90+ | ✅ 90+ | Full Support |
| Edge | ✅ 90+ | ✅ 90+ | Full Support |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Pipeline safety organizations for requirements guidance
- Open source mapping and geospatial communities
- Emergency response professionals for UX insights
- Azure and cloud infrastructure teams for hosting solutions

---

**🚨 Built with safety-first principles for community pipeline incident reporting**

For questions, support, or contributions, please open an issue or contact the development team.

[![Made with ❤️ for Community Safety](https://img.shields.io/badge/Made%20with-❤️%20for%20Community%20Safety-red.svg)](https://github.com/msftsean/pipeline-safety-reporter)