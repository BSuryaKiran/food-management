import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import NotificationBell from './NotificationBell.jsx';
import MessageCenter from './MessageCenter.jsx';
import StatCard from './StatCard.jsx';
import { getDefaultReceivedFood, getDefaultSeekerNotifications, getDefaultSeekerMessages } from '../utils/defaultData.js';

const SeekerDashboard = ({ user, onLogout }) => {
  const [requests, setRequests] = useState([]);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalReceived: 0,
    peopleServed: 0,
    activeRequests: 0
  });
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    urgency: 'medium',
    location: '',
    purpose: ''
  });
  const [errors, setErrors] = useState({});

  // Load requests from localStorage or use defaults
  useEffect(() => {
    const storedRequests = localStorage.getItem(`requests_${user.id}`);
    if (storedRequests) {
      try {
        const parsed = JSON.parse(storedRequests);
        setRequests(parsed);
        calculateStats(parsed);
      } catch (error) {
        console.error('Error loading requests:', error);
      }
    } else {
      // Load default received food data on first visit
      const defaultRequests = getDefaultReceivedFood(user.id);
      setRequests(defaultRequests);
      calculateStats(defaultRequests);
      localStorage.setItem(`requests_${user.id}`, JSON.stringify(defaultRequests));
    }

    // Load notifications
    const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      const defaultNotifications = getDefaultSeekerNotifications();
      setNotifications(defaultNotifications);
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(defaultNotifications));
    }

    // Load messages
    const storedMessages = localStorage.getItem(`messages_${user.id}`);
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    } else {
      const defaultMessages = getDefaultSeekerMessages();
      setMessages(defaultMessages);
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(defaultMessages));
    }

    // Simulate available donations (in real app, this would come from API)
    loadAvailableDonations();
  }, [user.id]);

  const loadAvailableDonations = () => {
    // Mock data for demonstration
    const mockDonations = [
      {
        id: 1,
        foodType: 'Fresh Vegetables',
        quantity: '10',
        unit: 'kg',
        expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Downtown Market',
        donorName: 'Green Grocery Store'
      },
      {
        id: 2,
        foodType: 'Bread & Bakery Items',
        quantity: '5',
        unit: 'kg',
        expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'City Bakery',
        donorName: 'Fresh Bakes'
      },
      {
        id: 3,
        foodType: 'Canned Goods',
        quantity: '20',
        unit: 'kg',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Warehouse District',
        donorName: 'Food Wholesaler'
      }
    ];
    setAvailableDonations(mockDonations);
  };

  const calculateStats = (requestsList) => {
    const completed = requestsList.filter(r => r.status === 'completed').length;
    const active = requestsList.filter(r => r.status === 'pending' || r.status === 'approved').length;
    const totalReceived = requestsList
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => {
        const weight = r.unit === 'kg' ? parseFloat(r.quantity) : parseFloat(r.quantity) / 1000;
        return sum + weight;
      }, 0);

    setStats({
      totalRequests: requestsList.length,
      totalReceived: totalReceived.toFixed(1),
      peopleServed: Math.floor(totalReceived * 4),
      activeRequests: active
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.foodType.trim()) {
      newErrors.foodType = 'Food type is required';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newRequest = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      seekerName: user.name
    };

    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);
    localStorage.setItem(`requests_${user.id}`, JSON.stringify(updatedRequests));
    calculateStats(updatedRequests);

    // Reset form
    setFormData({
      foodType: '',
      quantity: '',
      unit: 'kg',
      urgency: 'medium',
      location: '',
      purpose: ''
    });
    setShowModal(false);
  };

  const claimDonation = (donationId) => {
    alert('Donation claimed! The donor will be notified of your request.');
    // In a real app, this would send a request to the backend
  };

  const updateRequestStatus = (id, newStatus) => {
    const updatedRequests = requests.map(r =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem(`requests_${user.id}`, JSON.stringify(updatedRequests));
    calculateStats(updatedRequests);
  };

  const deleteRequest = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      const updatedRequests = requests.filter(r => r.id !== id);
      setRequests(updatedRequests);
      localStorage.setItem(`requests_${user.id}`, JSON.stringify(updatedRequests));
      calculateStats(updatedRequests);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      approved: 'badge-info',
      completed: 'badge-success'
    };
    return badges[status] || 'badge-warning';
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      low: 'badge-info',
      medium: 'badge-warning',
      high: 'badge-danger'
    };
    return badges[urgency] || 'badge-warning';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMarkNotificationAsRead = (id) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem(`notifications_${user.id}`, JSON.stringify([]));
  };

  const handleMarkMessageAsRead = (id) => {
    const updatedMessages = messages.map(m =>
      m.id === id ? { ...m, read: true } : m
    );
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${user.id}`, JSON.stringify(updatedMessages));
  };

  const handleDeleteMessage = (id) => {
    const updatedMessages = messages.filter(m => m.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${user.id}`, JSON.stringify(updatedMessages));
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <span className="logo-icon">🌱</span>
            <div>
              <h1 className="dashboard-title">Seeker Dashboard</h1>
              <p className="dashboard-subtitle">Welcome back, {user.name}!</p>
            </div>
          </div>
          <div className="header-actions">
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onClearAll={handleClearAllNotifications}
            />
            <MessageCenter
              messages={messages}
              onMarkAsRead={handleMarkMessageAsRead}
              onDeleteMessage={handleDeleteMessage}
            />
            <button onClick={onLogout} className="btn btn-outline logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main container">
        {/* Stats Section */}
        <section className="stats-section">
          <StatCard
            icon="📋"
            value={stats.totalRequests}
            label="Total Requests"
          />
          <StatCard
            icon="⚖️"
            value={`${stats.totalReceived} kg`}
            label="Food Received"
          />
          <StatCard
            icon="👥"
            value={stats.peopleServed}
            label="People Served"
          />
          <StatCard
            icon="⏳"
            value={stats.activeRequests}
            label="Active Requests"
          />
        </section>

        {/* Actions Section */}
        <section className="actions-section">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary add-donation-btn"
          >
            + Create New Request
          </button>
        </section>

        {/* Available Donations */}
        <section className="donations-section">
          <h2 className="section-title">Available Donations</h2>
          
          <div className="donations-grid">
            {availableDonations.map(donation => (
              <article key={donation.id} className="donation-card card">
                <div className="donation-header">
                  <h3 className="donation-title">{donation.foodType}</h3>
                  <span className="badge badge-success">Available</span>
                </div>
                
                <div className="donation-details">
                  <div className="detail-row">
                    <span className="detail-icon">👤</span>
                    <span className="detail-text">{donation.donorName}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-icon">📊</span>
                    <span className="detail-text">
                      {donation.quantity} {donation.unit}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-icon">📅</span>
                    <span className="detail-text">
                      Expires: {formatDate(donation.expiryDate)}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{donation.location}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => claimDonation(donation.id)}
                  className="btn btn-primary btn-claim"
                >
                  Claim Donation
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* Your Requests */}
        <section className="donations-section">
          <h2 className="section-title">Your Requests</h2>
          
          {requests.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-icon">📭</span>
              <h3>No requests yet</h3>
              <p>Create your first food request to get started!</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                Create Request
              </button>
            </div>
          ) : (
            <div className="donations-grid">
              {requests.map(request => (
                <article key={request.id} className="donation-card card">
                  <div className="donation-header">
                    <h3 className="donation-title">{request.foodType}</h3>
                    <div className="badge-group">
                      <span className={`badge ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                      <span className={`badge ${getUrgencyBadge(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="donation-details">
                    <div className="detail-row">
                      <span className="detail-icon">📊</span>
                      <span className="detail-text">
                        {request.quantity} {request.unit}
                      </span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{request.location}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="detail-icon">📝</span>
                      <span className="detail-text">{request.purpose}</span>
                    </div>
                  </div>
                  
                  <div className="donation-footer">
                    <small className="donation-date">
                      Created on {formatDate(request.createdAt)}
                    </small>
                    <div className="action-buttons">
                      {request.status === 'approved' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'completed')}
                          className="btn-action btn-complete"
                          title="Mark as completed"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteRequest(request.id)}
                        className="btn-delete"
                        title="Delete request"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create Request Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Food Request</h2>
              <button
                onClick={() => setShowModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="foodType" className="form-label">
                  Food Type *
                </label>
                <input
                  type="text"
                  id="foodType"
                  name="foodType"
                  className="form-input"
                  placeholder="e.g., Vegetables, Grains, Dairy"
                  value={formData.foodType}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
                {errors.foodType && (
                  <span className="form-error">{errors.foodType}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity" className="form-label">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.quantity && (
                    <span className="form-error">{errors.quantity}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="unit" className="form-label">
                    Unit *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    className="form-select"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="urgency" className="form-label">
                  Urgency Level *
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  className="form-select"
                  value={formData.urgency}
                  onChange={handleInputChange}
                  required
                >
                  <option value="low">Low - Can wait a week</option>
                  <option value="medium">Medium - Needed within 3 days</option>
                  <option value="high">High - Urgent (within 24 hours)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Delivery Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  placeholder="Enter delivery address"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {errors.location && (
                  <span className="form-error">{errors.location}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="purpose" className="form-label">
                  Purpose *
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  className="form-textarea"
                  placeholder="Describe how the food will be used (e.g., community kitchen, shelter, distribution)"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
                {errors.purpose && (
                  <span className="form-error">{errors.purpose}</span>
                )}
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeekerDashboard;
