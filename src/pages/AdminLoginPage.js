import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart } from '../store/slices/authSlice';
import { useTranslation } from '../utils/translations';
import './AdminLoginPage.css';

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch loginStart with credentials - saga will handle the API call
    dispatch(loginStart({
      username: formData.username,
      password: formData.password,
    }));
  };

  // Navigate to dashboard on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={`admin-login-page ${theme}`}>
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-logo">Premium Homes</h1>
            <h2>{t('admin.login.title')}</h2>
            <p>{t('admin.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">{t('admin.login.username')}</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={t('admin.login.usernamePlaceholder')}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t('admin.login.password')}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('admin.login.passwordPlaceholder')}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? t('admin.login.loggingIn') : t('admin.login.loginButton')}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>
              {t('admin.login.noAccount') || "Don't have an account?"}{' '}
              <Link to="/admin/register" className="register-link">
                {t('admin.login.registerLink') || 'Register here'}
              </Link>
            </p>
            <button
              onClick={() => navigate('/')}
              className="back-to-home"
            >
              ← {t('admin.login.backToHome') || 'Back to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
