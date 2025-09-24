# Invoice & Compliance Management System - Frontend

React-based frontend for the multi-tenant invoice and compliance management system with PostgreSQL backend integration.

## 🚀 Live Application

**Frontend URL**: `[Will update after deployment]`  
**Backend API**: `[Will update after deployment]`  
**GitHub Repository**: `https://github.com/SOUMIKBERA/invoice-compliance-system.git`

## 🔐 Demo Credentials

| Role | Email | Password | Access Level |
|------|--------|----------|--------------|
| **Admin** | admin@test.com | admin123 | Full system access |
| **Auditor** | auditor@test.com | auditor123 | Assigned vendors only |
| **Vendor** | vendor@test.com | vendor123 | Own data only |

## 🛠 Tech Stack

- **React 18** - Modern frontend framework
- **CSS3** - Custom styling with responsive design
- **Fetch API** - HTTP client for REST API calls
- **JWT Authentication** - Token-based secure authentication
- **Local Storage** - Client-side session management

## 📱 Features

### 🔑 Authentication System
- Secure login with JWT tokens
- Role-based access control
- Quick demo login buttons
- Automatic session management

### 👨‍💼 Admin Dashboard
- System overview with real-time analytics
- Create and manage auditors
- Create and manage vendors  
- Assign vendors to auditors
- Full system access and control
- User management interface

### 👩‍💼 Auditor Dashboard
- View assigned vendors only
- Review and approve/reject documents
- Monitor vendor activities and compliance
- Document status management
- Limited access to assigned data only

### 🏢 Vendor Dashboard
- Upload documents (invoices, reports, certificates, agreements)
- View document status and history
- Track approval/rejection status
- Manage company profile
- Access restricted to own data only

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Running backend server with PostgreSQL

### Installation
```bash
# Clone the repository
git clone https://github.com/SOUMIKBERA/invoice-compliance-system.git
cd invoice-compliance-system/frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

Application will open at `http://localhost:3000`

### Build for Production
```bash
# Create production build
npm run build

# The build folder contains optimized files ready for deployment
```

## 🌐 Deployment

### Environment Variables
Set the following environment variable in your hosting platform:

```env
REACT_APP_API_URL=https://backend-url.com/api
```

### Recommended Deployment Platforms
- **Railway** - Full-stack deployment with database
- **Netlify** - Drag and drop the `build` folder
- **Vercel** - Connect GitHub repository for auto-deployment
- **Render** - Static site hosting

### Deployment Steps
1. Build the application: `npm run build`
2. Deploy the `build` folder to your chosen platform
3. Set the `REACT_APP_API_URL` environment variable
4. Update CORS settings in backend for production URL

## 📁 Project Structure

```
src/
├── App.js          # Main application component with all dashboards
├── App.css         # Global styles and responsive design
└── index.js        # React DOM entry point

public/
├── index.html      # HTML template
├── favicon.ico     # Application favicon
└── manifest.json   # PWA manifest
```

## 🔧 Key Components

### Login Component
- Email/password authentication with validation
- Quick login buttons for demo testing
- Error handling and loading states
- JWT token management

### Admin Dashboard
- User management (create auditors/vendors)
- Assignment functionality (vendor to auditor)
- System analytics and statistics
- Real-time dashboard updates

### Auditor Dashboard
- Assigned vendor overview
- Document review interface
- Approval/rejection workflows
- Vendor activity monitoring

### Vendor Dashboard
- Document upload interface with drag-drop
- File management system
- Status tracking and history
- Category-based document organization

## 🎨 Design Features

- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Clean UI** - Professional interface with intuitive navigation
- **Role-based Layout** - Customized dashboards for each user type
- **Status Indicators** - Visual feedback for document states
- **Interactive Elements** - Smooth hover effects and transitions
- **Loading States** - User feedback during API calls
- **Error Handling** - Graceful error messages and recovery

## 🔒 Security Features

- **JWT Token Management** - Secure authentication tokens
- **Automatic Token Expiration** - Session timeout handling
- **Role-based Route Protection** - Access control per user role
- **Secure API Communication** - HTTPS and proper headers
- **Input Validation** - Client-side form validation
- **XSS Protection** - Sanitized user inputs

## 🧪 Testing Scenarios

### Admin Workflow Testing
1. Login with admin credentials (admin@test.com / admin123)
2. Navigate to "Manage Auditors" tab
3. Create new auditor: "John Smith" / "john@test.com" / "password123"
4. Navigate to "Manage Vendors" tab
5. Create new vendor: "XYZ Corp" / "xyz@test.com" / "password123"
6. Go to "Assignments" tab
7. Assign vendor to auditor
8. Verify assignment in dashboard statistics

### Auditor Workflow Testing
1. Login with auditor credentials (auditor@test.com / auditor123)
2. View "My Vendors" to see assigned vendors
3. Navigate to "Documents" tab
4. Review pending documents
5. Approve/reject documents and verify status updates
6. Check dashboard statistics for changes

### Vendor Workflow Testing
1. Login with vendor credentials (vendor@test.com / vendor123)
2. Navigate to "Upload Documents" tab
3. Select document category (invoice/report/certificate)
4. Upload a sample file
5. Navigate to "My Documents" tab
6. Verify document appears with "pending" status
7. Check dashboard for updated statistics

## 🚀 Performance Optimizations

- **Efficient State Management** - Minimal re-renders with proper state structure
- **Optimized Bundle Size** - Tree shaking and code splitting
- **Lazy Loading** - Components loaded on demand
- **Caching Strategy** - API response caching where appropriate
- **Fast Initial Load** - Optimized asset loading

## 🛠 Available Scripts

```bash
npm start          # Development server with hot reload
npm run build      # Production build with optimization
npm test           # Run test suite
npm run eject      # Eject from Create React App (not recommended)
```

## 🌟 Browser Support

- **Chrome** (latest 2 versions)
- **Firefox** (latest 2 versions)
- **Safari** (latest 2 versions)
- **Edge** (latest 2 versions)
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🔧 Integration with Backend

### API Communication
- RESTful API calls using Fetch API
- Proper error handling for network issues
- Authentication headers with JWT tokens
- File upload support with FormData

### Data Flow
1. **Authentication** - Login → JWT token → Store in localStorage
2. **Dashboard Data** - Fetch user-specific statistics and recent activity
3. **CRUD Operations** - Create, read, update users and documents
4. **File Uploads** - Multipart form data for document uploads
5. **Real-time Updates** - Refresh data after operations

## 📞 Support & Troubleshooting

### Common Issues
- **API Connection Errors**: Check REACT_APP_API_URL in .env file
- **Authentication Issues**: Clear localStorage and re-login
- **File Upload Problems**: Check file size limits and formats
- **CORS Errors**: Ensure backend allows frontend domain

### For Support
- **Repository Issues**: Create GitHub issue with details
- **Documentation**: Check main repository README
- **Backend API**: Refer to backend documentation in `/backend`

## 📈 Future Enhancements

- **Real-time Notifications** - WebSocket integration
- **Advanced File Preview** - In-browser document viewing
- **Bulk Operations** - Multiple document handling
- **Advanced Search** - Filter and search functionality
- **PWA Features** - Offline support and push notifications

---

**Built with React 18 and modern web technologies for enterprise-grade applications** ⭐