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

##  Local Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/SOUMIKBERA/invoice-compliance-system.git
cd invoice-compliance-system
```

### 2. Backend Setup
```bash
cd backend
npm install
mkdir uploads

# Create environment file
echo NODE_ENV=development > .env
echo JWT_SECRET=invoice_mgmt_secure_key_v1 >> .env
echo PORT=5000 >> .env

# Start backend server
npm start
```
Backend runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create environment file
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start frontend
npm start
```
Frontend runs on `http://localhost:3000`

## ⚙️ Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
JWT_SECRET=invoice_mgmt_secure_key_v1
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### For Production Deployment
- Update `NODE_ENV=production` in backend
- Update `REACT_APP_API_URL` to deployed backend URL
- Keep the same JWT_SECRET for consistency

## 📱 Key Features

### 🏢 Multi-Tenant Architecture
- **Complete data isolation** between vendors
- **Role-based access control** with three distinct user types
- **Secure tenant boundaries** ensuring privacy and compliance

### 👥 User Management
- **Admin**: System administration, user onboarding, vendor-auditor assignments
- **Auditor**: Document review, vendor monitoring, approval workflows
- **Vendor**: Document upload, status tracking, profile management

### 📄 Document Management
- **File upload system** with category classification
- **Status tracking** (pending, approved, rejected)
- **Document history** and audit trails
- **Multi-format support** (PDF, DOC, images)

### 📊 Analytics Dashboards
- **Real-time statistics** for all user roles
- **Activity monitoring** and recent document tracking
- **Performance metrics** and compliance reporting

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
│   ├── package.json         # Backend dependencies
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

### Option 1: Railway (Recommended)
1. Push code to GitHub
2. Deploy backend on Railway with environment variables
3. Deploy frontend on Railway with API URL configuration
4. Update README with live URLs

### Option 2: Render + Netlify
1. **Backend on Render**: Connect GitHub, add environment variables
2. **Frontend on Netlify**: Deploy build folder or connect GitHub

### Option 3: Vercel
1. Deploy both frontend and backend on Vercel
2. Configure environment variables
3. Update CORS settings for production

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt with salt rounds
- **Role-based Authorization** middleware
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests
- **File Upload Restrictions** for security

## 📋 Production Checklist

- [ ] Environment variables configured
- [ ] CORS origins restricted to production URLs
- [ ] File upload limits set appropriately
- [ ] JWT secret is secure and consistent
- [ ] Error logging implemented
- [ ] SSL certificates installed (handled by hosting platform)

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

**Built with modern web technologies and best practices for enterprise-grade applications** 