import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/propertyHelpers';
import { useTranslation } from '../../utils/translations';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  const { t } = useTranslation();
  const { id, title, location, price, currency, area, bedrooms, bathrooms, propertyType, transactionType, images } = property;

  // Translation helpers
  const getPropertyTypeLabel = (type) => {
    return t(`propertyTypes.${type}`) || type;
  };

  const getTransactionTypeLabel = (type) => {
    return t(`transactionTypes.${type}`) || type;
  };

  return (
    <div className="property-card">
      <div className="property-image-container">
        {images && images.length > 0 && images[0] ? (
          <img
            src={images[0]}
            alt={title}
            className="property-image"
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = e.target.nextElementSibling;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="no-image-placeholder" style={{ display: images && images.length > 0 && images[0] ? 'none' : 'flex' }}>
          <div className="placeholder-icon">🏠</div>
        </div>
        <div className="property-badges">
          <span className="badge badge-type">{getPropertyTypeLabel(propertyType)}</span>
          <span className="badge badge-transaction">{getTransactionTypeLabel(transactionType)}</span>
        </div>
      </div>
      <div className="property-content">
        <h3 className="property-title">{title}</h3>
        <p className="property-location">📍 {location}</p>
        <div className="property-details">
          <span>{area} m²</span>
          <span>•</span>
          <span>
            {bedrooms} {bedrooms === 1 
              ? t('propertyCard.bedroom')
              : t('propertyCard.bedrooms')}
          </span>
          {bathrooms > 0 && (
            <>
              <span>•</span>
              <span>
                {bathrooms} {bathrooms === 1
                  ? t('propertyCard.bath')
                  : t('propertyCard.baths')}
              </span>
            </>
          )}
        </div>
        <div className="property-price">
          {transactionType === 'rent' ? (
            <span className="price">
              {formatPrice(price, currency)}
              <span className="price-period">/{t('propertyCard.month')}</span>
            </span>
          ) : (
            <span className="price">{formatPrice(price, currency)}</span>
          )}
        </div>
        <Link to={`/property/${id}`} className="property-button">
          {t('propertyCard.viewDetails')}
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;
