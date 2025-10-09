import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [userType, setUserType] = useState('donor');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials
  const demoCredentials = {
    donor: { email: 'donor@example.com', password: 'donor123' },
    seeker: { email: 'seeker@example.com', password: 'seeker123' }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const demo = demoCredentials[userType];
      
      if (formData.email === demo.email && formData.password === demo.password) {
        const userData = {
          type: userType,
          email: formData.email,
          name: userType === 'donor' ? 'Food Donor' : 'Food Seeker',
          id: Date.now()
        };
        onLogin(userData);
      } else {
        setErrors({
          general: 'Invalid credentials. Please use demo credentials from README.'
        });
      }
      
      setIsLoading(false);
    }, 800);
  };

  const fillDemoCredentials = () => {
    const demo = demoCredentials[userType];
    setFormData({
      email: demo.email,
      password: demo.password
    });
    setErrors({});
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="logo">
          <span className="logo-icon">🌱</span>
          <h1>GreenBites</h1>
        </div>
        <p className="tagline">Reduce food wastage, improve food security</p>
      </header>

      <main className="login-main">
        <section className="login-card card fade-in">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue</p>

          {/* User Type Selection */}
          <div className="user-type-selector">
            <button
              type="button"
              className={`type-btn ${userType === 'donor' ? 'active' : ''}`}
              onClick={() => {
                setUserType('donor');
                setFormData({ email: '', password: '' });
                setErrors({});
              }}
            >
              <span className="type-icon">🍽️</span>
              <span>Food Donor</span>
            </button>
            <button
              type="button"
              className={`type-btn ${userType === 'seeker' ? 'active' : ''}`}
              onClick={() => {
                setUserType('seeker');
                setFormData({ email: '', password: '' });
                setErrors({});
              }}
            >
              <span className="type-icon">🤝</span>
              <span>Food Seeker</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {errors.general && (
              <div className="alert alert-error">
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoFocus
                autoComplete="email"
              />
              {errors.email && (
                <span className="form-error">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="form-error">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <button
              type="button"
              className="btn btn-outline demo-btn"
              onClick={fillDemoCredentials}
            >
              Fill Demo Credentials
            </button>
          </form>

          <aside className="login-info">
            <p className="info-text">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="info-text">
              Donor: donor@example.com / donor123
            </p>
            <p className="info-text">
              Seeker: seeker@example.com / seeker123
            </p>
          </aside>
        </section>

        <section className="features-section">
          <article className="feature-card card">
            <span className="feature-icon">📊</span>
            <h3>Track Impact</h3>
            <p>Monitor food donations and their impact on reducing waste</p>
          </article>
          <article className="feature-card card">
            <span className="feature-icon">🤝</span>
            <h3>Connect</h3>
            <p>Link donors with seekers to distribute surplus food</p>
          </article>
          <article className="feature-card card">
            <span className="feature-icon">🌍</span>
            <h3>Make a Difference</h3>
            <p>Contribute to food security and environmental sustainability</p>
          </article>
        </section>
      </main>

      <footer className="login-footer">
        <p>&copy; 2025 GreenBites. Reducing waste, feeding hope.</p>
      </footer>
    </div>
  );
};

export default Login;
