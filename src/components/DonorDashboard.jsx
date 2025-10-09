import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import NotificationBell from './NotificationBell.jsx';
import MessageCenter from './MessageCenter.jsx';
import StatCard from './StatCard.jsx';
import { getDefaultDonations, getDefaultDonorNotifications, getDefaultDonorMessages } from '../utils/defaultData.js';

const DonorDashboard = ({ user, onLogout }) => {
  const [donations, setDonations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalWeight: 0,
    peopleHelped: 0,
    co2Saved: 0
  });
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    unit: 'kg',
    expiryDate: '',
    location: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Load donations from localStorage or use defaults
  useEffect(() => {
    const storedDonations = localStorage.getItem(`donations_${user.id}`);
    if (storedDonations) {
      try {
        const parsed = JSON.parse(storedDonations);
        setDonations(parsed);
        calculateStats(parsed);
      } catch (error) {
        console.error('Error loading donations:', error);
      }
    } else {
      // Load default donations on first visit
      const defaultDonations = getDefaultDonations(user.id);
      setDonations(defaultDonations);
      calculateStats(defaultDonations);
      localStorage.setItem(`donations_${user.id}`, JSON.stringify(defaultDonations));
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
      const defaultNotifications = getDefaultDonorNotifications();
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
      const defaultMessages = getDefaultDonorMessages();
      setMessages(defaultMessages);
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(defaultMessages));
    }
  }, [user.id]);

  const calculateStats = (donationsList) => {
    const totalWeight = donationsList.reduce((sum, d) => {
      const weight = d.unit === 'kg' ? parseFloat(d.quantity) : parseFloat(d.quantity) / 1000;
      return sum + weight;
    }, 0);

    setStats({
      totalDonations: donationsList.length,
      totalWeight: totalWeight.toFixed(1),
      peopleHelped: Math.floor(totalWeight * 4), // Estimate: 1kg feeds 4 people
      co2Saved: (totalWeight * 2.5).toFixed(1) // Estimate: 1kg food = 2.5kg CO2
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

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate < today) {
        newErrors.expiryDate = 'Expiry date cannot be in the past';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newDonation = {
      id: Date.now(),
      ...formData,
      status: 'available',
      createdAt: new Date().toISOString(),
      donorName: user.name
    };

    const updatedDonations = [newDonation, ...donations];
    setDonations(updatedDonations);
    localStorage.setItem(`donations_${user.id}`, JSON.stringify(updatedDonations));
    calculateStats(updatedDonations);

    // Reset form
    setFormData({
      foodType: '',
      quantity: '',
      unit: 'kg',
      expiryDate: '',
      location: '',
      description: ''
    });
    setShowModal(false);
  };

  const deleteDonation = (id) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      const updatedDonations = donations.filter(d => d.id !== id);
      setDonations(updatedDonations);
      localStorage.setItem(`donations_${user.id}`, JSON.stringify(updatedDonations));
      calculateStats(updatedDonations);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      available: 'badge-success',
      claimed: 'badge-warning',
      completed: 'badge-info'
    };
    return badges[status] || 'badge-success';
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
              <h1 className="dashboard-title">Donor Dashboard</h1>
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
            icon="📦"
            value={stats.totalDonations}
            label="Total Donations"
          />
          <StatCard
            icon="⚖️"
            value={`${stats.totalWeight} kg`}
            label="Food Donated"
          />
          <StatCard
            icon="👥"
            value={stats.peopleHelped}
            label="People Helped"
          />
          <StatCard
            icon="🌍"
            value={`${stats.co2Saved} kg`}
            label="CO₂ Saved"
          />
        </section>

        {/* Actions Section */}
        <section className="actions-section">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary add-donation-btn"
          >
            + Add New Donation
          </button>
        </section>

        {/* Donations List */}
        <section className="donations-section">
          <h2 className="section-title">Your Donations</h2>
          
          {donations.length === 0 ? (
            <div className="empty-state card">
              <span className="empty-icon">📭</span>
              <h3>No donations yet</h3>
              <p>Start making a difference by adding your first food donation!</p>
              <button
                onClick={() => setShowModal(true)}
                className="btn btn-primary"
              >
                Add Donation
              </button>
            </div>
          ) : (
            <div className="donations-grid">
              {donations.map(donation => (
                <article key={donation.id} className="donation-card card">
                  <div className="donation-header">
                    <h3 className="donation-title">{donation.foodType}</h3>
                    <span className={`badge ${getStatusBadge(donation.status)}`}>
                      {donation.status}
                    </span>
                  </div>
                  
                  <div className="donation-details">
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
                    
                    {donation.description && (
                      <div className="detail-row">
                        <span className="detail-icon">📝</span>
                        <span className="detail-text">{donation.description}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="donation-footer">
                    <small className="donation-date">
                      Added on {formatDate(donation.createdAt)}
                    </small>
                    <button
                      onClick={() => deleteDonation(donation.id)}
                      className="btn-delete"
                      title="Delete donation"
                    >
                      🗑️
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add Donation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Donation</h2>
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
                  placeholder="e.g., Fresh Vegetables, Bread, Rice"
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
                <label htmlFor="expiryDate" className="form-label">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  className="form-input"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
                {errors.expiryDate && (
                  <span className="form-error">{errors.expiryDate}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  placeholder="Enter pickup address"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {errors.location && (
                  <span className="form-error">{errors.location}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  placeholder="Additional details about the food..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
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
                  Add Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
