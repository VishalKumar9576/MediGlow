import React, { useState, useEffect } from "react";
import "./AdminSettings.css";
import { fetchApi } from "../../api/client";

// Static styles outside the component to avoid re-creation and initialization issues
const staticStyles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    marginBottom: '2rem',
  },
  headerH1: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #1e293b, #3b82f6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerP: {
    color: '#64748b',
    marginTop: '0.5rem',
    fontSize: '0.95rem',
  },
  wrapper: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  sidebar: {
    flex: '1',
    minWidth: '250px',
    background: 'white',
    borderRadius: '20px',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    height: 'fit-content',
    position: 'sticky',
    top: '2rem',
  },
  tabBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    marginBottom: '8px',
    border: 'none',
    background: 'transparent',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#475569',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  tabBtnActive: {
    background: '#e0e7ff',
    color: '#1e40af',
  },
  content: {
    flex: '4',
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  panelTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  panelSub: {
    color: '#64748b',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
    fontSize: '0.9rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  infoCard: {
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '1.25rem',
    border: '1px solid #e2e8f0',
  },
  infoCardH3: {
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#475569',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #e2e8f0',
  },
  infoLabel: {
    fontWeight: '500',
    color: '#334155',
    fontSize: '0.9rem',
  },
  infoValue: {
    color: '#1e293b',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  badge: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  code: {
    fontFamily: 'Courier New, monospace',
    fontSize: '0.8rem',
    background: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '6px',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  editField: {
    marginTop: '0.5rem',
    marginBottom: '0.75rem',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  input: {
    flex: '1',
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    outline: 'none',
  },
  textarea: {
    flex: '1',
    padding: '8px 12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
  },
  btnSecondary: {
    background: '#f1f5f9',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '44px',
    height: '24px',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#cbd5e1',
    transition: '0.3s',
    borderRadius: '34px',
  },
  selectInput: {
    padding: '4px 8px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    background: 'white',
    fontSize: '0.85rem',
    cursor: 'pointer',
    outline: 'none',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    background: '#f8fafc',
    borderRadius: '12px',
    borderLeft: '3px solid #3b82f6',
  },
  activityIcon: {
    width: '32px',
    height: '32px',
    background: '#dbeafe',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
    fontSize: '0.9rem',
  },
  activityDetails: {
    flex: '1',
  },
  activityAction: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '0.9rem',
    marginBottom: '4px',
  },
  activityMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.75rem',
    color: '#64748b',
  },
  savingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  savingContent: {
    background: 'white',
    padding: '2rem',
    borderRadius: '16px',
    textAlign: 'center',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '12px 20px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    animation: 'slideIn 0.3s ease',
  },
};

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });
  const [adminData, setAdminData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    altEmail: "",
    role: "",
    department: "",
    employeeId: "",
    location: "",
    timezone: "",
    joinedDate: "",
    lastPromotion: "",
    bio: "",
    
    // Preferences
    theme: "light",
    language: "English (US)",
    dateFormat: "MM/DD/YYYY",
    dashboardLayout: "Compact",
    emailNotifications: true,
    weeklyReports: true,
    marketingUpdates: false,
    
    // Notification Settings
    notifSettings: {
      pushEnabled: true,
      emailAlerts: true,
      systemMaintenance: "email",
      newUserAlert: true,
      reportReady: false
    }
  });

  const [editMode, setEditMode] = useState({});
  const [activityLog, setActivityLog] = useState([]);

  // Fetch admin data on component mount
  useEffect(() => {
    fetchAdminData();
    fetchActivityLog();
  }, []);

  const showToastMessage = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
  };

  // Fetch all admin settings
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetchApi('/api/admin/settings');
      setAdminData(response);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToastMessage('Failed to load admin data', 'error');
      // Set default demo data if API fails
      setDefaultDemoData();
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity log
  const fetchActivityLog = async () => {
    try {
      const response = await fetchApi('/api/admin/activity');
      setActivityLog(response);
    } catch (error) {
      console.error('Error fetching activity log:', error);
      // Set demo activity data
      setDefaultActivityData();
    }
  };

  // Default demo data (fallback)
  const setDefaultDemoData = () => {
    setAdminData({
      fullName: "Alexandra Morgan",
      email: "alex.morgan@adminpanel.com",
      phone: "+1 (415) 867-5309",
      altEmail: "alex.admin@company.org",
      role: "Super Administrator",
      department: "IT & Operations",
      employeeId: "ADM-8842-XF",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles (PST)",
      joinedDate: "March 12, 2021",
      lastPromotion: "January 2024",
      bio: "Lead platform architect with 8+ years in SaaS security.",
      theme: "light",
      language: "English (US)",
      dateFormat: "MM/DD/YYYY",
      dashboardLayout: "Compact",
      emailNotifications: true,
      weeklyReports: true,
      marketingUpdates: false,
      notifSettings: {
        pushEnabled: true,
        emailAlerts: true,
        systemMaintenance: "email",
        newUserAlert: true,
        reportReady: false
      }
    });
  };

  const setDefaultActivityData = () => {
    setActivityLog([
      { id: 1, action: "Logged in from new device", timestamp: "2025-05-17 09:32 AM", ip: "192.168.12.45" },
      { id: 2, action: "Changed password", timestamp: "2025-05-10 2:15 PM", ip: "10.0.0.22" },
      { id: 3, action: "Updated notification preferences", timestamp: "2025-05-05 11:20 AM", ip: "192.168.1.1" }
    ]);
  };

  // Update admin field via API
  const updateAdminField = async (field, value, successMsg) => {
    try {
      setSaving(true);
      await fetchApi('/api/admin/settings', {
        method: 'PUT',
        body: { field, value }
      });
      
      setAdminData(prev => ({ ...prev, [field]: value }));
      showToastMessage(successMsg || `${field} updated successfully`);
      setEditMode({ ...editMode, [field]: false });
      
    } catch (error) {
      console.error('Error updating field:', error);
      showToastMessage(`Failed to update ${field}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Update nested field (like notification settings)
  const updateNestedField = async (parent, field, value, successMsg) => {
    try {
      setSaving(true);
      await fetchApi('/api/admin/settings/nested', {
        method: 'PUT',
        body: { parent, field, value }
      });
      
      setAdminData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [field]: value }
      }));
      showToastMessage(successMsg || `${field} updated successfully`);
      
    } catch (error) {
      console.error('Error updating nested field:', error);
      showToastMessage(`Failed to update ${field}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setSaving(true);
      const response = await fetchApi('/api/admin/upload-profile-image', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setAdminData(prev => ({ ...prev, profileImage: response.imageUrl }));
      showToastMessage('Profile image updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToastMessage('Failed to upload image', 'error');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div style={staticStyles.loadingContainer}>
        <div style={staticStyles.spinner}></div>
        <p>Loading admin settings...</p>
      </div>
    );
  }

  // Render functions (same as before, but with API integration)
  const renderProfileTab = () => (
    <div>
      <div style={staticStyles.panelTitle}>
        <i className="fas fa-user-circle"></i> Personal Information
      </div>
      <div style={staticStyles.panelSub}>Complete admin profile details</div>
      
      <div style={staticStyles.infoGrid}>
        <div style={staticStyles.infoCard}>
          <h3 style={staticStyles.infoCardH3}><i className="fas fa-user"></i> Basic Information</h3>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Full Name</span>
            <span style={staticStyles.infoValue}>{adminData.fullName}</span>
            <button style={staticStyles.editBtn} onClick={() => setEditMode({ ...editMode, fullName: true })}>
              <i className="fas fa-pen"></i>
            </button>
          </div>
          {editMode.fullName && (
            <div style={staticStyles.editField}>
              <input 
                type="text" 
                style={staticStyles.input}
                defaultValue={adminData.fullName}
                onBlur={(e) => updateAdminField('fullName', e.target.value, 'Name updated')}
                onKeyPress={(e) => e.key === 'Enter' && updateAdminField('fullName', e.target.value, 'Name updated')}
                autoFocus
              />
            </div>
          )}
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Role</span>
            <span style={staticStyles.infoValue}><span style={staticStyles.badge}>{adminData.role}</span></span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Department</span>
            <span style={staticStyles.infoValue}>{adminData.department}</span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Employee ID</span>
            <span style={staticStyles.infoValue}>{adminData.employeeId}</span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Joined Date</span>
            <span style={staticStyles.infoValue}>{adminData.joinedDate}</span>
          </div>
        </div>

        <div style={staticStyles.infoCard}>
          <h3 style={staticStyles.infoCardH3}><i className="fas fa-address-card"></i> Contact Details</h3>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Primary Email</span>
            <span style={staticStyles.infoValue}>{adminData.email}</span>
            <button style={staticStyles.editBtn} onClick={() => setEditMode({ ...editMode, email: true })}>
              <i className="fas fa-pen"></i>
            </button>
          </div>
          {editMode.email && (
            <div style={staticStyles.editField}>
              <input 
                type="email" 
                style={staticStyles.input}
                defaultValue={adminData.email}
                onBlur={(e) => updateAdminField('email', e.target.value, 'Email updated')}
              />
            </div>
          )}
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Alternate Email</span>
            <span style={staticStyles.infoValue}>{adminData.altEmail}</span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Phone Number</span>
            <span style={staticStyles.infoValue}>{adminData.phone}</span>
            <button style={staticStyles.editBtn} onClick={() => setEditMode({ ...editMode, phone: true })}>
              <i className="fas fa-pen"></i>
            </button>
          </div>
          {editMode.phone && (
            <div style={staticStyles.editField}>
              <input 
                type="tel" 
                style={staticStyles.input}
                defaultValue={adminData.phone}
                onBlur={(e) => updateAdminField('phone', e.target.value, 'Phone updated')}
              />
            </div>
          )}
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Location</span>
            <span style={staticStyles.infoValue}>{adminData.location}</span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Timezone</span>
            <span style={staticStyles.infoValue}>{adminData.timezone}</span>
          </div>
        </div>

        <div style={staticStyles.infoCard}>
          <h3 style={staticStyles.infoCardH3}><i className="fas fa-info-circle"></i> Additional Info</h3>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Last Promotion</span>
            <span style={staticStyles.infoValue}>{adminData.lastPromotion}</span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Bio</span>
            <span style={staticStyles.infoValue}>{adminData.bio}</span>
            <button style={staticStyles.editBtn} onClick={() => setEditMode({ ...editMode, bio: true })}>
              <i className="fas fa-pen"></i>
            </button>
          </div>
          {editMode.bio && (
            <div style={staticStyles.editField}>
              <textarea 
                style={staticStyles.textarea}
                defaultValue={adminData.bio}
                rows="3"
                onBlur={(e) => updateAdminField('bio', e.target.value, 'Bio updated')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );



  const renderPreferencesTab = () => (
    <div>
      <div style={staticStyles.panelTitle}>
        <i className="fas fa-sliders-h"></i> Preferences
      </div>
      <div style={staticStyles.panelSub}>Customize your dashboard experience</div>
      
      <div style={staticStyles.infoGrid}>
        <div style={staticStyles.infoCard}>
          <h3 style={staticStyles.infoCardH3}><i className="fas fa-palette"></i> Appearance</h3>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Theme</span>
            <span style={staticStyles.infoValue}>
              <select 
                style={staticStyles.selectInput}
                value={adminData.theme}
                onChange={(e) => updateAdminField('theme', e.target.value, 'Theme updated')}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Language</span>
            <span style={staticStyles.infoValue}>
              <select 
                style={staticStyles.selectInput}
                value={adminData.language}
                onChange={(e) => updateAdminField('language', e.target.value, 'Language updated')}
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Date Format</span>
            <span style={staticStyles.infoValue}>
              <select 
                style={staticStyles.selectInput}
                value={adminData.dateFormat}
                onChange={(e) => updateAdminField('dateFormat', e.target.value, 'Date format updated')}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Dashboard Layout</span>
            <span style={staticStyles.infoValue}>
              <select 
                style={staticStyles.selectInput}
                value={adminData.dashboardLayout}
                onChange={(e) => updateAdminField('dashboardLayout', e.target.value, 'Layout updated')}
              >
                <option value="Compact">Compact</option>
                <option value="Comfortable">Comfortable</option>
                <option value="Detailed">Detailed</option>
              </select>
            </span>
          </div>
        </div>

        <div style={staticStyles.infoCard}>
          <h3 style={staticStyles.infoCardH3}><i className="fas fa-bell"></i> Notifications</h3>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Email Notifications</span>
            <span style={staticStyles.infoValue}>
              <label style={staticStyles.switch}>
                <input 
                  type="checkbox" 
                  style={staticStyles.switchInput}
                  checked={adminData.emailNotifications}
                  onChange={(e) => updateAdminField('emailNotifications', e.target.checked)}
                />
                <span style={staticStyles.slider}></span>
              </label>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Weekly Reports</span>
            <span style={staticStyles.infoValue}>
              <label style={staticStyles.switch}>
                <input 
                  type="checkbox" 
                  style={staticStyles.switchInput}
                  checked={adminData.weeklyReports}
                  onChange={(e) => updateAdminField('weeklyReports', e.target.checked)}
                />
                <span style={staticStyles.slider}></span>
              </label>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Marketing Updates</span>
            <span style={staticStyles.infoValue}>
              <label style={staticStyles.switch}>
                <input 
                  type="checkbox" 
                  style={staticStyles.switchInput}
                  checked={adminData.marketingUpdates}
                  onChange={(e) => updateAdminField('marketingUpdates', e.target.checked)}
                />
                <span style={staticStyles.slider}></span>
              </label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div>
      <div style={staticStyles.panelTitle}>
        <i className="fas fa-history"></i> Account Activity
      </div>
      <div style={staticStyles.panelSub}>Recent login history and security events</div>
      
      <div style={staticStyles.activityList}>
        {activityLog.map(activity => (
          <div key={activity.id} style={staticStyles.activityItem}>
            <div style={staticStyles.activityIcon}>
              <i className="fas fa-circle-info"></i>
            </div>
            <div style={staticStyles.activityDetails}>
              <div style={staticStyles.activityAction}>{activity.action}</div>
              <div style={staticStyles.activityMeta}>
                <span><i className="far fa-clock"></i> {activity.timestamp}</span>
                <span><i className="fas fa-network-wired"></i> {activity.ip}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationTab = () => (
    <div>
      <div style={staticStyles.panelTitle}>
        <i className="fas fa-bell"></i> Notification Settings
      </div>
      <div style={staticStyles.panelSub}>Configure how you receive alerts</div>
      
      <div style={staticStyles.infoGrid}>
        <div style={staticStyles.infoCard}>
          <h3 style={staticStyles.infoCardH3}><i className="fas fa-mobile-alt"></i> Push Notifications</h3>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Push Notifications</span>
            <span style={staticStyles.infoValue}>
              <label style={staticStyles.switch}>
                <input 
                  type="checkbox" 
                  style={staticStyles.switchInput}
                  checked={adminData.notifSettings.pushEnabled}
                  onChange={(e) => updateNestedField('notifSettings', 'pushEnabled', e.target.checked)}
                />
                <span style={staticStyles.slider}></span>
              </label>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Email Alerts</span>
            <span style={staticStyles.infoValue}>
              <label style={staticStyles.switch}>
                <input 
                  type="checkbox" 
                  style={staticStyles.switchInput}
                  checked={adminData.notifSettings.emailAlerts}
                  onChange={(e) => updateNestedField('notifSettings', 'emailAlerts', e.target.checked)}
                />
                <span style={staticStyles.slider}></span>
              </label>
            </span>
          </div>
          
        </div>

        <div style={staticStyles.infoCard}>
          <h3 style={staticStyles.infoCardH3}><i className="fas fa-envelope"></i> Email Preferences</h3>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>System Maintenance</span>
            <span style={staticStyles.infoValue}>
              <select 
                style={staticStyles.selectInput}
                value={adminData.notifSettings.systemMaintenance}
                onChange={(e) => updateNestedField('notifSettings', 'systemMaintenance', e.target.value)}
              >
                <option value="email">Email</option>
                <option value="push">Push</option>
                <option value="none">None</option>
              </select>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>New User Alerts</span>
            <span style={staticStyles.infoValue}>
              <label style={staticStyles.switch}>
                <input 
                  type="checkbox" 
                  style={staticStyles.switchInput}
                  checked={adminData.notifSettings.newUserAlert}
                  onChange={(e) => updateNestedField('notifSettings', 'newUserAlert', e.target.checked)}
                />
                <span style={staticStyles.slider}></span>
              </label>
            </span>
          </div>
          
          <div style={staticStyles.infoRow}>
            <span style={staticStyles.infoLabel}>Report Ready</span>
            <span style={staticStyles.infoValue}>
              <label style={staticStyles.switch}>
                <input 
                  type="checkbox" 
                  style={staticStyles.switchInput}
                  checked={adminData.notifSettings.reportReady}
                  onChange={(e) => updateNestedField('notifSettings', 'reportReady', e.target.checked)}
                />
                <span style={staticStyles.slider}></span>
              </label>
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={staticStyles.container}>
      {/* Saving Overlay */}
      <div style={{...staticStyles.savingOverlay, display: saving ? 'flex' : 'none'}}>
        <div style={staticStyles.savingContent}>
          <div style={staticStyles.spinner}></div>
          <p>Saving changes...</p>
        </div>
      </div>

      {showToast.show && (
        <div style={{...staticStyles.toast, background: showToast.type === 'success' ? '#10b981' : '#ef4444'}}>
          <i className={`fas fa-${showToast.type === 'success' ? 'check-circle' : 'exclamation-triangle'}`}></i>
          {showToast.message}
        </div>
      )}
      
      <div style={staticStyles.header}>
        <h1 style={staticStyles.headerH1}>
          <i className="fas fa-user-shield"></i>
          Admin Settings
        </h1>
        <p style={staticStyles.headerP}>Manage your profile, security, and preferences</p>
      </div>
      
      <div style={staticStyles.wrapper}>
        <div style={staticStyles.sidebar}>
          <button 
            style={{...staticStyles.tabBtn, ...(activeTab === 'profile' ? staticStyles.tabBtnActive : {})}}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            <span>Profile</span>
          </button>
          <button 
            style={{...staticStyles.tabBtn, ...(activeTab === 'preferences' ? staticStyles.tabBtnActive : {})}}
            onClick={() => setActiveTab('preferences')}
          >
            <i className="fas fa-sliders-h"></i>
            <span>Preferences</span>
          </button>
          <button 
            style={{...staticStyles.tabBtn, ...(activeTab === 'activity' ? staticStyles.tabBtnActive : {})}}
            onClick={() => setActiveTab('activity')}
          >
            <i className="fas fa-history"></i>
            <span>Activity</span>
          </button>
          <button 
            style={{...staticStyles.tabBtn, ...(activeTab === 'notifications' ? staticStyles.tabBtnActive : {})}}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i>
            <span>Notifications</span>
          </button>
        </div>
        
        <div style={staticStyles.content}>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'activity' && renderActivityTab()}
          {activeTab === 'notifications' && renderNotificationTab()}
        </div>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        button:hover {
          transform: translateY(-1px);
        }
        input:focus, textarea:focus, select:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;