import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../utils/translations';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Premium Homes</h3>
            <p>
              {t('footer.description')}
            </p>
          </div>
          <div className="footer-section">
            <h4>{t('footer.menu')}</h4>
            <ul>
              <li><Link to="/">{t('header.home')}</Link></li>
              <li><Link to="/">{t('header.properties')}</Link></li>
              <li><Link to="/offices">{t('header.offices')}</Link></li>
              <li><Link to="/team">{t('header.team')}</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.propertyTypes')}</h4>
            <ul>
              <li><Link to="/">{t('propertyTypes.apartment')}</Link></li>
              <li><Link to="/">{t('propertyTypes.villa')}</Link></li>
              <li><Link to="/">{t('propertyTypes.office')}</Link></li>
              <li><Link to="/">{t('propertyTypes.land')}</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>{t('footer.contact')}</h4>
            <p>📞 +355 42 212 121</p>
            <p>✉️ info@premiumhomes.al</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Premium Homes. {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
