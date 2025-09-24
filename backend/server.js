const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'invoice_mgmt_secure_key_v1';

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:IntoTheWild123@localhost:5432/invoice_system',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

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

// Database initialization
const initializeDatabase = async () => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        assigned_vendors INTEGER[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        vendor_id INTEGER REFERENCES users(id),
        filename VARCHAR(255) NOT NULL,
        filepath VARCHAR(255),
        category VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default users if they don't exist
    const adminExists = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@test.com']);
    if (adminExists.rows.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await pool.query(
        'INSERT INTO users (email, password, role, name) VALUES ($1, $2, $3, $4)',
        ['admin@test.com', hashedPassword, 'admin', 'Admin User']
      );

      const auditorPassword = bcrypt.hashSync('auditor123', 10);
      const auditorResult = await pool.query(
        'INSERT INTO users (email, password, role, name, assigned_vendors) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        ['auditor@test.com', auditorPassword, 'auditor', 'John Auditor', '{}']
      );

      const vendorPassword = bcrypt.hashSync('vendor123', 10);
      const vendorResult = await pool.query(
        'INSERT INTO users (email, password, role, name, company_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        ['vendor@test.com', vendorPassword, 'vendor', 'ABC Corp', 'ABC Corporation']
      );

      // Assign vendor to auditor
      const vendorId = vendorResult.rows[0].id;
      await pool.query(
        'UPDATE users SET assigned_vendors = $1 WHERE id = $2',
        [[vendorId], auditorResult.rows[0].id]
      );

      // Insert sample document
      await pool.query(
        'INSERT INTO documents (vendor_id, filename, category, status) VALUES ($1, $2, $3, $4)',
        [vendorId, 'sample-invoice.pdf', 'invoice', 'pending']
      );

      console.log('Default users and data created successfully');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize database on startup
initializeDatabase();

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
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = result.rows[0];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard
app.get('/api/admin/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const vendorsResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['vendor']);
    const auditorsResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['auditor']);
    const documentsResult = await pool.query('SELECT COUNT(*) FROM documents');
    const recentDocs = await pool.query(
      'SELECT d.*, u.name as vendor_name FROM documents d JOIN users u ON d.vendor_id = u.id ORDER BY d.upload_date DESC LIMIT 5'
    );
    
    res.json({
      totalVendors: parseInt(vendorsResult.rows[0].count),
      totalAuditors: parseInt(auditorsResult.rows[0].count),
      totalDocuments: parseInt(documentsResult.rows[0].count),
      recentActivity: recentDocs.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create auditor
app.post('/api/admin/auditors', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { name, email, password } = req.body;
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, assigned_vendors) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, 'auditor', '{}']
    );

    const { password: _, ...auditorResponse } = result.rows[0];
    res.status(201).json(auditorResponse);
  } catch (error) {
    console.error('Create auditor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create vendor
app.post('/api/admin/vendors', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { name, email, password, companyName } = req.body;
    
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, company_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, 'vendor', companyName]
    );

    const { password: _, ...vendorResponse } = result.rows[0];
    res.status(201).json(vendorResponse);
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const vendorsResult = await pool.query('SELECT id, name, email, company_name, created_at FROM users WHERE role = $1', ['vendor']);
    const auditorsResult = await pool.query('SELECT id, name, email, assigned_vendors, created_at FROM users WHERE role = $1', ['auditor']);

    res.json({
      vendors: vendorsResult.rows,
      auditors: auditorsResult.rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign vendor to auditor
app.post('/api/admin/assignments', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const { auditorId, vendorId } = req.body;
    
    const auditorResult = await pool.query('SELECT assigned_vendors FROM users WHERE id = $1 AND role = $2', [auditorId, 'auditor']);
    if (auditorResult.rows.length === 0) {
      return res.status(404).json({ message: 'Auditor not found' });
    }

    let assignedVendors = auditorResult.rows[0].assigned_vendors || [];
    if (!assignedVendors.includes(vendorId)) {
      assignedVendors.push(vendorId);
    }

    await pool.query('UPDATE users SET assigned_vendors = $1 WHERE id = $2', [assignedVendors, auditorId]);
    res.json({ message: 'Vendor assigned successfully' });
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auditor dashboard
app.get('/api/auditor/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'auditor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const auditorResult = await pool.query('SELECT assigned_vendors FROM users WHERE id = $1', [req.user.id]);
    const assignedVendorIds = auditorResult.rows[0].assigned_vendors || [];
    
    let vendorCount = 0;
    let totalDocuments = 0;
    let pendingReviews = 0;
    let recentDocuments = [];

    if (assignedVendorIds.length > 0) {
      const vendorCountResult = await pool.query(
        'SELECT COUNT(*) FROM users WHERE id = ANY($1)',
        [assignedVendorIds]
      );
      vendorCount = parseInt(vendorCountResult.rows[0].count);

      const documentsResult = await pool.query(
        'SELECT COUNT(*) FROM documents WHERE vendor_id = ANY($1)',
        [assignedVendorIds]
      );
      totalDocuments = parseInt(documentsResult.rows[0].count);

      const pendingResult = await pool.query(
        'SELECT COUNT(*) FROM documents WHERE vendor_id = ANY($1) AND status = $2',
        [assignedVendorIds, 'pending']
      );
      pendingReviews = parseInt(pendingResult.rows[0].count);

      const recentResult = await pool.query(
        'SELECT d.*, u.name as vendor_name FROM documents d JOIN users u ON d.vendor_id = u.id WHERE d.vendor_id = ANY($1) ORDER BY d.upload_date DESC LIMIT 5',
        [assignedVendorIds]
      );
      recentDocuments = recentResult.rows;
    }

    res.json({
      assignedVendors: vendorCount,
      totalDocuments,
      pendingReviews,
      recentDocuments
    });
  } catch (error) {
    console.error('Auditor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assigned vendors for auditor
app.get('/api/auditor/vendors', authenticateToken, async (req, res) => {
  if (req.user.role !== 'auditor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const auditorResult = await pool.query('SELECT assigned_vendors FROM users WHERE id = $1', [req.user.id]);
    const assignedVendorIds = auditorResult.rows[0].assigned_vendors || [];

    if (assignedVendorIds.length === 0) {
      return res.json([]);
    }

    const vendorsResult = await pool.query(
      'SELECT id, name, email, company_name FROM users WHERE id = ANY($1)',
      [assignedVendorIds]
    );

    res.json(vendorsResult.rows);
  } catch (error) {
    console.error('Get assigned vendors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vendor dashboard
app.get('/api/vendor/dashboard', authenticateToken, async (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const totalResult = await pool.query('SELECT COUNT(*) FROM documents WHERE vendor_id = $1', [req.user.id]);
    const pendingResult = await pool.query('SELECT COUNT(*) FROM documents WHERE vendor_id = $1 AND status = $2', [req.user.id, 'pending']);
    const approvedResult = await pool.query('SELECT COUNT(*) FROM documents WHERE vendor_id = $1 AND status = $2', [req.user.id, 'approved']);
    const recentResult = await pool.query('SELECT * FROM documents WHERE vendor_id = $1 ORDER BY upload_date DESC LIMIT 5', [req.user.id]);
    
    res.json({
      totalDocuments: parseInt(totalResult.rows[0].count),
      pendingDocs: parseInt(pendingResult.rows[0].count),
      approvedDocs: parseInt(approvedResult.rows[0].count),
      recentDocuments: recentResult.rows
    });
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get documents
app.get('/api/documents', authenticateToken, async (req, res) => {
  try {
    let query = '';
    let params = [];

    if (req.user.role === 'admin') {
      query = 'SELECT d.*, u.name as vendor_name FROM documents d JOIN users u ON d.vendor_id = u.id ORDER BY d.upload_date DESC';
    } else if (req.user.role === 'auditor') {
      const auditorResult = await pool.query('SELECT assigned_vendors FROM users WHERE id = $1', [req.user.id]);
      const assignedVendorIds = auditorResult.rows[0].assigned_vendors || [];
      
      if (assignedVendorIds.length === 0) {
        return res.json([]);
      }
      
      query = 'SELECT d.*, u.name as vendor_name FROM documents d JOIN users u ON d.vendor_id = u.id WHERE d.vendor_id = ANY($1) ORDER BY d.upload_date DESC';
      params = [assignedVendorIds];
    } else if (req.user.role === 'vendor') {
      query = 'SELECT d.*, u.name as vendor_name FROM documents d JOIN users u ON d.vendor_id = u.id WHERE d.vendor_id = $1 ORDER BY d.upload_date DESC';
      params = [req.user.id];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload document
app.post('/api/documents/upload', authenticateToken, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ message: 'Only vendors can upload documents' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO documents (vendor_id, filename, filepath, category, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, req.file.originalname, req.file.path, req.body.category || 'other', 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document status
app.put('/api/documents/:id/status', authenticateToken, async (req, res) => {
  if (req.user.role !== 'auditor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const docId = parseInt(req.params.id);
    const { status } = req.body;
    
    const documentResult = await pool.query('SELECT * FROM documents WHERE id = $1', [docId]);
    if (documentResult.rows.length === 0) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const document = documentResult.rows[0];

    // Check if auditor has access to this document
    if (req.user.role === 'auditor') {
      const auditorResult = await pool.query('SELECT assigned_vendors FROM users WHERE id = $1', [req.user.id]);
      const assignedVendorIds = auditorResult.rows[0].assigned_vendors || [];
      
      if (!assignedVendorIds.includes(document.vendor_id)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const updatedResult = await pool.query(
      'UPDATE documents SET status = $1 WHERE id = $2 RETURNING *',
      [status, docId]
    );

    res.json(updatedResult.rows[0]);
  } catch (error) {
    console.error('Update document status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});