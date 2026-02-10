import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerStart } from '../store/slices/authSlice';
import { useTranslation } from '../utils/translations';
import './AdminRegisterPage.css';

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    mobile: '',
    city: 'Tirana',
    title: 'Agent',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Dispatch registerStart with credentials and agent data
    dispatch(registerStart({
      username: formData.username,
      password: formData.password,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      city: formData.city,
      title: formData.title,
    }));
  };

  // Navigate to dashboard on successful registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`admin-register-page ${theme}`}>
      <div className="admin-register-container">
        <div className="admin-register-card">
          <div className="admin-register-header">
            <h1 className="admin-logo">Premium Homes</h1>
            <h2>{t('title') || 'Create Admin Account'}</h2>
            <p>{t('subtitle') || 'Register as an admin and agent'}</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-register-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-section">
              <h3 className="form-section-title">{t('accountInfo') || 'Account Information'}</h3>
              
              <div className="form-group">
                <label htmlFor="username">{t('username') || 'Username'} *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t('usernamePlaceholder') || 'Choose a username'}
                  required
                  autoComplete="username"
                  className={validationErrors.username ? 'error' : ''}
                />
                {validationErrors.username && (
                  <span className="field-error">{validationErrors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">{t('password') || 'Password'} *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('passwordPlaceholder') || 'At least 6 characters'}
                  required
                  autoComplete="new-password"
                  className={validationErrors.password ? 'error' : ''}
                />
                {validationErrors.password && (
                  <span className="field-error">{validationErrors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t('confirmPassword') || 'Confirm Password'} *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t('admin.register.confirmPasswordPlaceholder') || 'Re-enter your password'}
                  required
                  autoComplete="new-password"
                  className={validationErrors.confirmPassword ? 'error' : ''}
                />
                {validationErrors.confirmPassword && (
                  <span className="field-error">{validationErrors.confirmPassword}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">{t('admin.register.agentInfo') || 'Agent Information'}</h3>
              
              <div className="form-group">
                <label htmlFor="name">{t('admin.register.name') || 'Full Name'} *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('admin.register.namePlaceholder') || 'Your full name'}
                  required
                  className={validationErrors.name ? 'error' : ''}
                />
                {validationErrors.name && (
                  <span className="field-error">{validationErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('admin.register.email') || 'Email'} *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('admin.register.emailPlaceholder') || 'your.email@example.com'}
                  required
                  autoComplete="email"
                  className={validationErrors.email ? 'error' : ''}
                />
                {validationErrors.email && (
                  <span className="field-error">{validationErrors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="mobile">{t('admin.register.mobile') || 'Mobile Number'} *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder={t('admin.register.mobilePlaceholder') || '+355 69 123 4567'}
                  required
                  autoComplete="tel"
                  className={validationErrors.mobile ? 'error' : ''}
                />
                {validationErrors.mobile && (
                  <span className="field-error">{validationErrors.mobile}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">{t('admin.register.city') || 'City'} *</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="Tirana">Tirana</option>
                    <option value="Durrës">Durrës</option>
                    <option value="Vlorë">Vlorë</option>
                    <option value="Sarandë">Sarandë</option>
                    <option value="Shkodër">Shkodër</option>
                    <option value="Korçë">Korçë</option>
                    <option value="Elbasan">Elbasan</option>
                    <option value="Fier">Fier</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="title">{t('admin.register.title') || 'Title'} *</label>
                  <select
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  >
                    <option value="Agent">Agent</option>
                    <option value="Broker">Broker</option>
                    <option value="Office Manager">Office Manager</option>
                    <option value="Estate Office">Estate Office</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="admin-register-button"
              disabled={loading}
            >
              {loading ? (t('admin.register.registering') || 'Creating Account...') : (t('admin.register.registerButton') || 'Create Account')}
            </button>
          </form>

          <div className="admin-register-footer">
            <p>
              {t('admin.register.alreadyHaveAccount') || 'Already have an account?'}{' '}
              <Link to="/admin/login" className="login-link">
                {t('admin.register.loginLink') || 'Login here'}
              </Link>
            </p>
            <button
              onClick={() => navigate('/')}
              className="back-to-home"
            >
              ← {t('admin.register.backToHome') || 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
