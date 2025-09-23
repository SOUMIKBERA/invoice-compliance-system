const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-here';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// In-memory database (replace with PostgreSQL in production)
let users = [
  {
    id: 1,
    email: 'admin@test.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'auditor@test.com',
    password: bcrypt.hashSync('auditor123', 10),
    role: 'auditor',
    name: 'John Auditor',
    assignedVendors: [3]
  },
  {
    id: 3,
    email: 'vendor@test.com',
    password: bcrypt.hashSync('vendor123', 10),
    role: 'vendor',
    name: 'ABC Corp',
    companyName: 'ABC Corporation'
  }
];

let documents = [
  {
    id: 1,
    vendorId: 3,
    filename: 'sample-invoice.pdf',
    category: 'invoice',
    uploadDate: new Date().toISOString(),
    status: 'pending'
  }
];

let nextUserId = 4;
let nextDocId = 2;

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Admin routes
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const vendors = users.filter(u => u.role === 'vendor');
  const auditors = users.filter(u => u.role === 'auditor');
  
  res.json({
    totalVendors: vendors.length,
    totalAuditors: auditors.length,
    totalDocuments: documents.length,
    recentActivity: documents.slice(-5)
  });
});

// Create auditor
app.post('/api/admin/auditors', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, email, password } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newAuditor = {
    id: nextUserId++,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'auditor',
    assignedVendors: []
  };

  users.push(newAuditor);
  const { password: _, ...auditorResponse } = newAuditor;
  res.status(201).json(auditorResponse);
});

// Create vendor
app.post('/api/admin/vendors', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, email, password, companyName } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  const newVendor = {
    id: nextUserId++,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: 'vendor',
    companyName
  };

  users.push(newVendor);
  const { password: _, ...vendorResponse } = newVendor;
  res.status(201).json(vendorResponse);
});

// Get all vendors and auditors
app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const vendors = users.filter(u => u.role === 'vendor').map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
  
  const auditors = users.filter(u => u.role === 'auditor').map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });

  res.json({ vendors, auditors });
});

// Assign vendor to auditor
app.post('/api/admin/assignments', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { auditorId, vendorId } = req.body;
  const auditor = users.find(u => u.id === auditorId);
  
  if (!auditor || auditor.role !== 'auditor') {
    return res.status(404).json({ message: 'Auditor not found' });
  }

  if (!auditor.assignedVendors) {
    auditor.assignedVendors = [];
  }

  if (!auditor.assignedVendors.includes(vendorId)) {
    auditor.assignedVendors.push(vendorId);
  }

  res.json({ message: 'Vendor assigned successfully' });
});

// Auditor routes
app.get('/api/auditor/dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'auditor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const auditor = users.find(u => u.id === req.user.id);
  const assignedVendorIds = auditor.assignedVendors || [];
  const assignedVendors = users.filter(u => assignedVendorIds.includes(u.id));
  const vendorDocuments = documents.filter(doc => assignedVendorIds.includes(doc.vendorId));

  res.json({
    assignedVendors: assignedVendors.length,
    totalDocuments: vendorDocuments.length,
    pendingReviews: vendorDocuments.filter(doc => doc.status === 'pending').length,
    recentDocuments: vendorDocuments.slice(-5)
  });
});

app.get('/api/auditor/vendors', authenticateToken, (req, res) => {
  if (req.user.role !== 'auditor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const auditor = users.find(u => u.id === req.user.id);
  const assignedVendorIds = auditor.assignedVendors || [];
  const assignedVendors = users.filter(u => assignedVendorIds.includes(u.id))
    .map(u => {
      const { password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });

  res.json(assignedVendors);
});

// Vendor routes
app.get('/api/vendor/dashboard', authenticateToken, (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const vendorDocs = documents.filter(doc => doc.vendorId === req.user.id);
  
  res.json({
    totalDocuments: vendorDocs.length,
    pendingDocs: vendorDocs.filter(doc => doc.status === 'pending').length,
    approvedDocs: vendorDocs.filter(doc => doc.status === 'approved').length,
    recentDocuments: vendorDocs.slice(-5)
  });
});

// Document routes
app.get('/api/documents', authenticateToken, (req, res) => {
  let userDocuments = [];

  if (req.user.role === 'admin') {
    userDocuments = documents;
  } else if (req.user.role === 'auditor') {
    const auditor = users.find(u => u.id === req.user.id);
    const assignedVendorIds = auditor.assignedVendors || [];
    userDocuments = documents.filter(doc => assignedVendorIds.includes(doc.vendorId));
  } else if (req.user.role === 'vendor') {
    userDocuments = documents.filter(doc => doc.vendorId === req.user.id);
  }

  // Add vendor info to documents
  const documentsWithVendor = userDocuments.map(doc => {
    const vendor = users.find(u => u.id === doc.vendorId);
    return {
      ...doc,
      vendorName: vendor ? vendor.name : 'Unknown'
    };
  });

  res.json(documentsWithVendor);
});

app.post('/api/documents/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can upload documents' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const newDocument = {
    id: nextDocId++,
    vendorId: req.user.id,
    filename: req.file.originalname,
    filepath: req.file.path,
    category: req.body.category || 'other',
    uploadDate: new Date().toISOString(),
    status: 'pending'
  };

  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Update document status
app.put('/api/documents/:id/status', authenticateToken, (req, res) => {
  if (req.user.role !== 'auditor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const docId = parseInt(req.params.id);
  const { status } = req.body;
  const document = documents.find(doc => doc.id === docId);

  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }

  // Check if auditor has access to this document
  if (req.user.role === 'auditor') {
    const auditor = users.find(u => u.id === req.user.id);
    const assignedVendorIds = auditor.assignedVendors || [];
    if (!assignedVendorIds.includes(document.vendorId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
  }

  document.status = status;
  res.json(document);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});