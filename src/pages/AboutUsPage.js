import React from 'react';
import { useTranslation } from '../utils/translations';
import './AboutUsPage.css';

const AboutUsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="about-us-page">
      <div className="container">
        <div className="about-us-header">
          <h1>{t('aboutUs.title') || 'About Us'}</h1>
          <p className="about-us-subtitle">{t('aboutUs.subtitle') || 'Premium Homes Real Estate'}</p>
        </div>

        <div className="about-us-content">
          <div className="about-us-section">
            <p className="about-us-text">
              {t('aboutUs.paragraph1') || 'At Premium Homes Real Estate, we believe that finding the right home is more than a transaction — it\'s a life decision. Built on integrity, expertise, and a deep understanding of the property market, we are dedicated to helping our clients buy, sell, and invest with confidence.'}
            </p>

            <p className="about-us-text">
              {t('aboutUs.paragraph2') || 'With a focus on quality homes and premium properties, our team combines local market knowledge with personalized service to deliver exceptional results. Whether you are searching for your dream home, selling a valued property, or exploring investment opportunities, we take the time to understand your goals and guide you every step of the way.'}
            </p>

            <p className="about-us-text">
              {t('aboutUs.paragraph3') || 'What sets Premium Homes Real Estate apart is our commitment to transparency, professionalism, and long-term relationships. We pride ourselves on clear communication, honest advice, and tailored solutions designed around your unique needs.'}
            </p>

            <p className="about-us-text">
              {t('aboutUs.paragraph4') || 'From first-time buyers to seasoned investors, our mission is simple: to make your real estate journey seamless, rewarding, and successful. At Premium Homes Real Estate, your future begins with the right home.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
