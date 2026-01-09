import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatPrice } from '../../utils/propertyHelpers';
import { useTranslation } from '../../utils/translations';
import './PropertyDetails.css';

const PropertyDetails = ({ property }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    id,
    title,
    location,
    address,
    price,
    currency,
    area,
    bedrooms,
    bathrooms,
    floor,
    furnished,
    elevator,
    propertyType,
    transactionType,
    images,
    description,
  } = property;

  const getPropertyTypeLabel = (type) => {
    return t(`propertyTypes.${type}`) || type;
  };

  const getTransactionTypeLabel = (type) => {
    return t(`transactionTypes.${type}`) || type;
  };

  return (
    <div className="property-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            {t('header.home')}
          </button>
          <span className="breadcrumb-separator">/</span>
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            {t('header.properties')}
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{title}</span>
        </nav>

        {/* Property Header */}
        <div className="property-header">
          <div className="property-header-info">
            <h1 className="property-title-large">{title}</h1>
            <p className="property-address">{address || location}</p>
            <p className="property-id">Property ID: {id}</p>
          </div>
          <div className="property-header-actions">
            <button className="btn-secondary" onClick={() => window.print()}>
              {t('propertyDetails.save')}
            </button>
            <button className="btn-secondary" onClick={() => navigate(`/map?propertyId=${id}`)}>
              {t('propertyDetails.viewOnMap')}
            </button>
          </div>
        </div>

        {/* Main Image Gallery */}
        <div className="property-gallery">
          <div className="main-image-container">
            {images && images.length > 0 && images[0] ? (
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={title}
                className="main-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="no-image-placeholder" style={{ display: images && images.length > 0 && images[0] ? 'none' : 'flex' }}>
              <div className="placeholder-icon">🏠</div>
              <p>{t('propertyDetails.noImage') || 'No Image Available'}</p>
            </div>
            {property.featured && (
              <span className="featured-badge">{t('propertyDetails.reserved')}</span>
            )}
          </div>
          {images && images.length > 1 && (
            <div className="thumbnail-gallery">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${title} ${index + 1}`}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Property Info Grid */}
        <div className="property-info-grid">
          <div className="property-main-info">
            {/* Price */}
            <div className="price-section">
              <h2 className="price-large">
                {transactionType === 'rent' ? (
                  <>
                    {formatPrice(price, currency)}
                    <span className="price-period">/{t('propertyCard.month')}</span>
                  </>
                ) : (
                  formatPrice(price, currency)
                )}
              </h2>
            </div>

            {/* Key Details */}
            <div className="key-details">
              <div className="detail-item">
                <span className="detail-label">{t('propertyDetails.totalArea')}</span>
                <span className="detail-value">{area} m²</span>
              </div>
              {bedrooms && (
                <div className="detail-item">
                  <span className="detail-label">{t('propertyDetails.bedrooms')}</span>
                  <span className="detail-value">{bedrooms}</span>
                </div>
              )}
              {bathrooms && (
                <div className="detail-item">
                  <span className="detail-label">{t('propertyDetails.bathrooms')}</span>
                  <span className="detail-value">{bathrooms}</span>
                </div>
              )}
              {floor && (
                <div className="detail-item">
                  <span className="detail-label">{t('propertyDetails.floor')}</span>
                  <span className="detail-value">{floor}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">{t('propertyDetails.type')}</span>
                <span className="detail-value">{getPropertyTypeLabel(propertyType)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('propertyDetails.furnished')}</span>
                <span className="detail-value">{furnished ? t('common.yes') : t('common.no')}</span>
              </div>
              {elevator !== undefined && (
                <div className="detail-item">
                  <span className="detail-label">{t('propertyDetails.elevator')}</span>
                  <span className="detail-value">{elevator ? t('common.yes') : t('common.no')}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">{t('propertyDetails.transactionType')}</span>
                <span className="detail-value">{getTransactionTypeLabel(transactionType)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h3>{t('propertyDetails.description')}</h3>
              <p>{description || t('propertyDetails.defaultDescription')}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="property-sidebar">
            {/* Agent Info */}
            <div className="agent-card">
              <div className="agent-avatar">👤</div>
              <h4>Premium Homes Agent</h4>
              <p>License: 1234</p>
              <p>📧 info@premiumhomes.al</p>
              <p>📞 +355 42 212 121</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
