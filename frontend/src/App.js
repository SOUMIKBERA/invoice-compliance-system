import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Login Component
const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email, password) => {
    setCredentials({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Invoice & Compliance System</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="quick-login">
          <h4>Quick Login (Demo):</h4>
          <div className="quick-buttons">
            <button onClick={() => quickLogin('admin@test.com', 'admin123')}>Admin</button>
            <button onClick={() => quickLogin('auditor@test.com', 'auditor123')}>Auditor</button>
            <button onClick={() => quickLogin('vendor@test.com', 'vendor123')}>Vendor</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Components
const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState({ vendors: [], auditors: [] });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async (userType) => {
    try {
      const response = await fetch(`${API_BASE}/admin/${userType}s`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert(`${userType} created successfully!`);
        fetchUsers();
        setFormData({});
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Error creating user');
    }
  };

  const assignVendor = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          auditorId: parseInt(formData.auditorId),
          vendorId: parseInt(formData.vendorId)
        })
      });
      
      if (response.ok) {
        alert('Vendor assigned successfully!');
        setFormData({});
      }
    } catch (error) {
      alert('Error assigning vendor');
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'auditors' ? 'active' : ''} 
          onClick={() => setActiveTab('auditors')}
        >
          Manage Auditors
        </button>
        <button 
          className={activeTab === 'vendors' ? 'active' : ''} 
          onClick={() => setActiveTab('vendors')}
        >
          Manage Vendors
        </button>
        <button 
          className={activeTab === 'assignments' ? 'active' : ''} 
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
      </nav>

      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          <h2>Admin Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Vendors</h3>
              <div className="stat-number">{stats.totalVendors || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Total Auditors</h3>
              <div className="stat-number">{stats.totalAuditors || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Total Documents</h3>
              <div className="stat-number">{stats.totalDocuments || 0}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auditors' && (
        <div className="dashboard-content">
          <h2>Manage Auditors</h2>
          <div className="form-section">
            <h3>Create New Auditor</h3>
            <input
              placeholder="Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              placeholder="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              placeholder="Password"
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button onClick={() => createUser('auditor')}>Create Auditor</button>
          </div>
          
          <div className="users-list">
            <h3>Existing Auditors</h3>
            {users.auditors.map(auditor => (
              <div key={auditor.id} className="user-item">
                <span>{auditor.name} ({auditor.email})</span>
                <span>Assigned Vendors: {auditor.assignedVendors?.length || 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="dashboard-content">
          <h2>Manage Vendors</h2>
          <div className="form-section">
            <h3>Create New Vendor</h3>
            <input
              placeholder="Contact Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
              placeholder="Company Name"
              value={formData.companyName || ''}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            />
            <input
              placeholder="Email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input
              placeholder="Password"
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button onClick={() => createUser('vendor')}>Create Vendor</button>
          </div>
          
          <div className="users-list">
            <h3>Existing Vendors</h3>
            {users.vendors.map(vendor => (
              <div key={vendor.id} className="user-item">
                <span>{vendor.name} - {vendor.companyName}</span>
                <span>{vendor.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="dashboard-content">
          <h2>Assign Vendors to Auditors</h2>
          <div className="form-section">
            <select 
              value={formData.auditorId || ''} 
              onChange={(e) => setFormData({...formData, auditorId: e.target.value})}
            >
              <option value="">Select Auditor</option>
              {users.auditors.map(auditor => (
                <option key={auditor.id} value={auditor.id}>{auditor.name}</option>
              ))}
            </select>
            <select 
              value={formData.vendorId || ''} 
              onChange={(e) => setFormData({...formData, vendorId: e.target.value})}
            >
              <option value="">Select Vendor</option>
              {users.vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>{vendor.companyName}</option>
              ))}
            </select>
            <button onClick={assignVendor}>Assign Vendor</button>
          </div>
        </div>
      )}
    </div>
  );
};

const AuditorDashboard = () => {
  const [stats, setStats] = useState({});
  const [vendors, setVendors] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
    fetchVendors();
    fetchDocuments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/auditor/dashboard`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${API_BASE}/auditor/vendors`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/documents`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const updateDocumentStatus = async (docId, status) => {
    try {
      const response = await fetch(`${API_BASE}/documents/${docId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchDocuments();
        alert('Document status updated!');
      }
    } catch (error) {
      alert('Error updating document status');
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'vendors' ? 'active' : ''} 
          onClick={() => setActiveTab('vendors')}
        >
          My Vendors
        </button>
        <button 
          className={activeTab === 'documents' ? 'active' : ''} 
          onClick={() => setActiveTab('documents')}
        >
          Documents
        </button>
      </nav>

      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          <h2>Auditor Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Assigned Vendors</h3>
              <div className="stat-number">{stats.assignedVendors || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Total Documents</h3>
              <div className="stat-number">{stats.totalDocuments || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Pending Reviews</h3>
              <div className="stat-number">{stats.pendingReviews || 0}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="dashboard-content">
          <h2>Assigned Vendors</h2>
          <div className="vendors-list">
            {vendors.map(vendor => (
              <div key={vendor.id} className="vendor-card">
                <h3>{vendor.companyName}</h3>
                <p>Contact: {vendor.name}</p>
                <p>Email: {vendor.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="dashboard-content">
          <h2>Document Review</h2>
          <div className="documents-list">
            {documents.map(doc => (
              <div key={doc.id} className="document-card">
                <h4>{doc.filename}</h4>
                <p>Vendor: {doc.vendorName}</p>
                <p>Category: {doc.category}</p>
                <p>Status: <span className={`status ${doc.status}`}>{doc.status}</span></p>
                <p>Upload Date: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                <div className="document-actions">
                  <button 
                    onClick={() => updateDocumentStatus(doc.id, 'approved')}
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => updateDocumentStatus(doc.id, 'rejected')}
                    className="reject-btn"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VendorDashboard = () => {
  const [stats, setStats] = useState({});
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadCategory, setUploadCategory] = useState('invoice');

  useEffect(() => {
    fetchDashboardData();
    fetchDocuments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/vendor/dashboard`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/documents`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('category', uploadCategory);

    try {
      const response = await fetch(`${API_BASE}/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        alert('File uploaded successfully!');
        setUploadFile(null);
        fetchDocuments();
        fetchDashboardData();
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Error uploading file');
    }
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'upload' ? 'active' : ''} 
          onClick={() => setActiveTab('upload')}
        >
          Upload Documents
        </button>
        <button 
          className={activeTab === 'documents' ? 'active' : ''} 
          onClick={() => setActiveTab('documents')}
        >
          My Documents
        </button>
      </nav>

      {activeTab === 'dashboard' && (
        <div className="dashboard-content">
          <h2>Vendor Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Documents</h3>
              <div className="stat-number">{stats.totalDocuments || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Pending Review</h3>
              <div className="stat-number">{stats.pendingDocs || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Approved</h3>
              <div className="stat-number">{stats.approvedDocs || 0}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="dashboard-content">
          <h2>Upload Documents</h2>
          <form onSubmit={handleFileUpload} className="upload-form">
            <div className="form-group">
              <label>Document Category:</label>
              <select 
                value={uploadCategory} 
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                <option value="invoice">Invoice</option>
                <option value="report">Report</option>
                <option value="certificate">Certificate</option>
                <option value="agreement">Agreement</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Select File:</label>
              <input
                type="file"
                onChange={(e) => setUploadFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>
            <button type="submit">Upload Document</button>
          </form>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="dashboard-content">
          <h2>My Documents</h2>
          <div className="documents-list">
            {documents.map(doc => (
              <div key={doc.id} className="document-card">
                <h4>{doc.filename}</h4>
                <p>Category: {doc.category}</p>
                <p>Status: <span className={`status ${doc.status}`}>{doc.status}</span></p>
                <p>Upload Date: {new Date(doc.uploadDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Invoice & Compliance System</h1>
        <div className="user-info">
          <span>Welcome, {user.name} ({user.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main>
        {user.role === 'admin' && <AdminDashboard />}
        {user.role === 'auditor' && <AuditorDashboard />}
        {user.role === 'vendor' && <VendorDashboard />}
      </main>
    </div>
  );
}

export default App;