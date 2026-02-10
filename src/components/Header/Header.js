import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu, closeMenu, toggleTheme, setLanguage } from '../../store/slices/uiSlice';
import { useTranslation } from '../../utils/translations';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const { theme, language, isMenuOpen } = useSelector((state) => state.ui);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  const menuItems = [
    { label: t('header.home'), path: '/' },
    { label: t('header.properties'), path: '/properties' },
    { label: t('header.agents'), path: '/agents' },
    { label: t('header.aboutUs'), path: '/about' },
  ];

  return (
    <header className={`header ${theme}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img 
              src={`${process.env.PUBLIC_URL || ''}/logo.jpeg`}
              alt="Premium Homes" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'block';
                }
              }}
            />
            <h1 className="logo-text">Premium Homes</h1>
          </Link>
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link to={item.path} onClick={() => dispatch(closeMenu())}>
                    {item.label}
                  </Link>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <Link to="/admin/dashboard" onClick={() => dispatch(closeMenu())} className="nav-admin-link">
                    {t('header.dashboard')}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <div className="header-right">
            <div className="header-contact">
              <span className="phone-icon">📞</span>
              <span>+355 69 304 0629</span>
            </div>
            <div className="header-controls">
              {isAuthenticated && (
                <Link to="/admin/dashboard" className="admin-dashboard-link">
                  {t('header.dashboard')}
                </Link>
              )}
              <div className="language-switcher">
                <button
                  className={language === 'en' ? 'active' : ''}
                  onClick={() => dispatch(setLanguage('en'))}
                >
                  EN
                </button>
                <button
                  className={language === 'sq' ? 'active' : ''}
                  onClick={() => dispatch(setLanguage('sq'))}
                >
                  SQ
                </button>
              </div>
              <button
                className="theme-toggle"
                onClick={() => dispatch(toggleTheme())}
                aria-label={t('header.toggleTheme')}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
            <button
              className="menu-toggle"
              onClick={() => dispatch(toggleMenu())}
              aria-label={t('header.toggleMenu')}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
