import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../utils/translations';
import './CitiesSection.css';

const CitiesSection = () => {
  const { t } = useTranslation();
  const selectedCity = useSelector((state) => state.filters.city);

  const currentCity =
    !selectedCity || selectedCity === 'all' ? 'Tirana' : selectedCity;

  const mapQuery = encodeURIComponent(`${currentCity}, Albania`);

  return (
    <section className="cities-section">
      <div className="container">
        <h2 className="section-title">
          {t('cities.mainCities')}
        </h2>
        <p className="section-subtitle">
          {t('cities.subtitle')}
        </p>
        <div className="cities-map-wrapper">
          <iframe
            title="Cities Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
