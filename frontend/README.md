# Invoice & Compliance Management System - Frontend

React-based frontend for the multi-tenant invoice and compliance management system.

## 🚀 Live Application

**Frontend URL**: [ will update deployed frontend URL here]
**Backend API**: [will update deployed backend URL here]
**GitHub Repository**: [https://github.com/SOUMIKBERA/invoice-compliance-system.git]

## 🔐 Demo Credentials

- **Admin**: admin@test.com / admin123
- **Auditor**: auditor@test.com / auditor123
- **Vendor**: vendor@test.com / vendor123

## 🛠 Tech Stack

- **React 18** - Frontend framework
- **CSS3** - Custom styling with responsive design
- **Fetch API** - HTTP client for API calls
- **JWT** - Token-based authentication
- **Local Storage** - Session management

## 📱 Features

### Admin Dashboard
- System overview with analytics
- Create and manage auditors
- Create and manage vendors
- Assign vendors to auditors
- Full system access

### Auditor Dashboard
- View assigned vendors
- Review and approve/reject documents
- Monitor vendor activities
- Limited access to assigned data only

### Vendor Dashboard
- Upload documents (invoices, reports, certificates)
- View document status and history
- Manage company profile
- Access to own data only

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [https://github.com/SOUMIKBERA/invoice-compliance-system.git]
cd invoice-compliance-system/frontend

# Install dependencies
npm install

# Set environment variable (optional for local development)
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

```
REACT_APP_API_URL= will update https://-backend-url.com/api
```

### Deployment Platforms
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repository
- **Railway**: Deploy directly from repository

## 📁 Project Structure

```
src/
├── App.js          # Main application component with routing logic
├── App.css         # Global styles and responsive design
└── index.js        # React DOM entry point

public/
├── index.html      # HTML template
└── ...             # Static assets
```

## 🔧 Key Components

### Login Component
- Email/password authentication
- Quick login buttons for demo
- Error handling and loading states

### Admin Dashboard
- User management (auditors/vendors)
- Assignment functionality
- System analytics

### Auditor Dashboard
- Assigned vendor overview
- Document review interface
- Approval/rejection workflows

### Vendor Dashboard
- Document upload interface
- File management system
- Status tracking

## 🎨 Design Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Clean UI** - Professional interface with intuitive navigation
- **Role-based Layout** - Different dashboards for each user type
- **Status Indicators** - Visual feedback for document states
- **Interactive Elements** - Smooth hover effects and transitions

## 🔒 Security Features

- JWT token management
- Automatic token expiration handling
- Role-based route protection
- Secure API communication
- Input validation

## 🧪 Testing the Application

### Admin Flow
1. Login with admin credentials
2. Create new auditor: "John Smith" / "john@test.com"
3. Create new vendor: "XYZ Corp" / "xyz@test.com"
4. Assign vendor to auditor
5. Verify assignment in dashboard

### Auditor Flow
1. Login with auditor credentials
2. View assigned vendors
3. Check pending documents
4. Approve/reject sample documents

### Vendor Flow
1. Login with vendor credentials
2. Upload a sample document
3. Select document category
4. Check upload status
5. View document history

## 🚀 Performance Optimizations

- Efficient state management
- Optimized re-renders
- Lazy loading where appropriate
- Minimal bundle size
- Fast initial load time

## 🛠 Available Scripts

```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🌟 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📞 Support

For any issues or questions regarding the frontend application, please refer to the main repository README or contact the development team.

---

