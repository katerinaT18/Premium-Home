import React from 'react';
import { cities } from '../../data/sampleProperties';
import { useTranslation } from '../../utils/translations';
import './CitiesSection.css';

const CitiesSection = () => {
  const { t } = useTranslation();

  return (
    <section className="cities-section">
      <div className="container">
        <h2 className="section-title">
          {t('cities.mainCities')}
        </h2>
        <p className="section-subtitle">
          {t('cities.subtitle')}
        </p>
        <div className="cities-grid">
          {cities.map((city, index) => (
            <div key={index} className="city-card">
              <h3>{city.name}</h3>
              <p className="city-count">
                {city.count}+ {t('cities.properties')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;
