# Invoice & Compliance Management System

A comprehensive multi-tenant invoice and compliance management system with role-based access control, built for modern businesses to streamline vendor management and document workflows.

## 🌐 Live Application

**Frontend URL**: `[Will add after deployment]`  
**Backend API**: `[Will add after deployment]`  
**GitHub Repository**: `https://github.com/SOUMIKBERA/invoice-compliance-system.git`

## 🔐 Demo Credentials

Test the system with these pre-configured accounts:

| Role | Email | Password | Access Level |
|------|--------|----------|--------------|
| **Admin** | admin@test.com | admin123 | Full system access |
| **Auditor** | auditor@test.com | auditor123 | Assigned vendors only |
| **Vendor** | vendor@test.com | vendor123 | Own data only |

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern component-based UI
- **CSS3** - Custom responsive styling
- **Fetch API** - RESTful API integration
- **JWT Authentication** - Secure session management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Database
- **PostgreSQL 16.3** - Production-grade database
- **pg ^8.16.3** - Node.js PostgreSQL client

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL 16.3 (or compatible version)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/SOUMIKBERA/invoice-compliance-system.git
cd invoice-compliance-system
```

### 2. Database Setup
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE invoice_system;
\q
```

### 3. Backend Setup
```bash
cd backend
npm install
mkdir uploads

# Create environment file
echo NODE_ENV=development > .env
echo JWT_SECRET=invoice_mgmt_secure_key_v1 >> .env
echo PORT=5000 >> .env
echo DATABASE_URL=postgresql://postgres:your_password@localhost:5432/invoice_system >> .env

# Start backend server
npm start
```
Backend runs on `http://localhost:5000`

### 4. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment file
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start frontend
npm start
```
Frontend runs on `http://localhost:3000`

### 5. Database Initialization
The application automatically creates tables and seeds default users on first run.

## ⚙️ Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
JWT_SECRET=invoice_mgmt_secure_key_v1
PORT=5000

# PostgreSQL connection
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/invoice_system
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### For Production Deployment
```env
# Backend production
NODE_ENV=production
JWT_SECRET=invoice_mgmt_secure_key_v1
PORT=5000
DATABASE_URL=postgresql://username:password@host:port/database

# Frontend production
REACT_APP_API_URL=https://your-backend-url.com/api
```

## 📱 Key Features

### 🏢 Multi-Tenant Architecture
- **Complete data isolation** between vendors
- **Role-based access control** with three distinct user types
- **Secure tenant boundaries** ensuring privacy and compliance
- **PostgreSQL schema design** for scalable multi-tenancy

### 👥 User Management
- **Admin**: System administration, user onboarding, vendor-auditor assignments
- **Auditor**: Document review, vendor monitoring, approval workflows
- **Vendor**: Document upload, status tracking, profile management

### 📄 Document Management
- **File upload system** with category classification
- **Status tracking** (pending, approved, rejected)
- **Document history** and audit trails
- **Multi-format support** (PDF, DOC, images)
- **Database-backed persistence**

### 📊 Analytics Dashboards
- **Real-time statistics** for all user roles
- **Activity monitoring** and recent document tracking
- **Performance metrics** and compliance reporting

## 🗃️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  assigned_vendors INTEGER[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Documents Table
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER REFERENCES users(id),
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(255),
  category VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing Scenarios

### Complete Admin Workflow
1. Login as admin (admin@test.com / admin123)
2. Create new auditor: "Jane Smith" / "jane@company.com" / "password123"
3. Create new vendor: "Tech Solutions Ltd" / "tech@solutions.com" / "password123"
4. Assign vendor to auditor
5. Verify assignment in dashboard

### Auditor Review Process
1. Login as auditor (auditor@test.com / auditor123)
2. View assigned vendors list
3. Check pending document reviews
4. Approve/reject documents with status updates
5. Monitor vendor activity

### Vendor Submission Flow
1. Login as vendor (vendor@test.com / vendor123)
2. Navigate to document upload
3. Select file and category (invoice/report/certificate)
4. Submit document
5. Track approval status

## 📡 API Documentation

### Health Check
```http
GET /api/health              # Database connection status
```

### Authentication Endpoints
```http
POST /api/auth/login          # User authentication
GET  /api/auth/me            # Get current user info
```

### Admin Endpoints
```http
GET  /api/admin/dashboard     # Admin statistics
POST /api/admin/auditors     # Create auditor
POST /api/admin/vendors      # Create vendor
GET  /api/admin/users        # List all users
POST /api/admin/assignments  # Assign vendor to auditor
```

### Auditor Endpoints
```http
GET /api/auditor/dashboard   # Auditor statistics
GET /api/auditor/vendors     # Assigned vendors
```

### Vendor Endpoints
```http
GET /api/vendor/dashboard    # Vendor statistics
```

### Document Endpoints
```http
GET /api/documents           # Get user documents
POST /api/documents/upload   # Upload document (vendors)
PUT /api/documents/:id/status # Update status (auditors/admins)
```

## 🏗 Project Structure

```
invoice-compliance-system/
├── README.md                 # This file
├── backend/                  # Node.js API server
│   ├── server.js            # Main server application
│   ├── package.json         # Backend dependencies (includes pg ^8.16.3)
│   ├── .env                 # Environment variables
│   └── uploads/             # File storage directory
├── frontend/                # React application
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Application styles
│   │   └── index.js        # React entry point
│   ├── package.json        # Frontend dependencies
│   ├── .env                # Environment variables
│   └── README.md           # Frontend documentation
```

## 🚀 Deployment Guide

### Option 1: Railway (Recommended for PostgreSQL)
1. Push code to GitHub
2. Deploy backend with PostgreSQL addon
3. Railway auto-configures DATABASE_URL
4. Deploy frontend with backend API URL
5. Update README with live URLs

### Option 2: Render + PostgreSQL
1. **Create PostgreSQL database** on Render
2. **Deploy backend** with database connection
3. **Deploy frontend** on Netlify
4. Configure environment variables

### Option 3: Supabase + Vercel
1. **Use Supabase** for PostgreSQL hosting
2. **Deploy backend** on Vercel with Supabase connection
3. **Deploy frontend** on Vercel

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Role-based Authorization** middleware
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests
- **File Upload Restrictions** for security
- **PostgreSQL injection protection** with parameterized queries

## 📋 Production Checklist

- [ ] PostgreSQL database created and accessible
- [ ] Environment variables configured with secure DATABASE_URL
- [ ] CORS origins restricted to production URLs
- [ ] File upload limits set appropriately
- [ ] JWT secret is secure and consistent
- [ ] Database connection pooling configured
- [ ] SSL/TLS enabled for database connections

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request

## 📞 Support

For technical questions or support:
- **Repository Issues**: Create GitHub issue
- **Documentation**: Check `/frontend/README.md` for frontend specifics

## 📄 License

This project is licensed under the MIT License.

---

**Built with modern web technologies and PostgreSQL for enterprise-grade applications** 