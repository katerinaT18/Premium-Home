import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllProperties } from '../store/selectors/propertySelectors';
import { useTranslation } from '../utils/translations';
import './MapPage.css';

const MapPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const properties = useSelector(selectAllProperties);
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const propertyId = searchParams.get('propertyId');
  const highlightedProperty = propertyId 
    ? properties.find(p => p.id === parseInt(propertyId))
    : null;

  useEffect(() => {
    if (highlightedProperty) {
      setSelectedProperty(highlightedProperty);
    }
  }, [highlightedProperty]);

  // Generate Google Maps search URL (works without API key, opens in new tab)
  const getMapSearchUrl = (property) => {
    const address = encodeURIComponent(property.address || property.location || 'Tirana, Albania');
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  // Open property in Google Maps (no API key needed)
  const openInGoogleMaps = (property) => {
    const url = getMapSearchUrl(property);
    window.open(url, '_blank');
  };

  return (
    <div className="map-page">
      <div className="container">
        <div className="map-page-header">
          <h1>{t('map.title') || 'View Properties on Map'}</h1>
          <button 
            className="btn-close" 
            onClick={() => navigate(-1)}
            aria-label="Close map"
          >
            ×
          </button>
        </div>

        <div className="map-container">
          <div className="map-wrapper">
            {selectedProperty ? (
              <div className="map-content">
                <div className="map-iframe-container">
                  <iframe
                    ref={mapRef}
                    title="Property Map"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(selectedProperty.address || selectedProperty.location || 'Tirana, Albania')}&output=embed`}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => {}}
                  />
                </div>
                <div className="map-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => openInGoogleMaps(selectedProperty)}
                  >
                    {t('map.openInGoogleMaps') || 'Open in Google Maps'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="map-placeholder">
                <p>{t('map.selectProperty') || 'Select a property to view on map'}</p>
                {properties.length > 0 && (
                  <button 
                    className="btn-primary"
                    onClick={() => setSelectedProperty(properties[0])}
                  >
                    {t('map.viewFirstProperty') || 'View First Property'}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="map-sidebar">
            <h3>{t('map.allProperties') || 'All Properties'}</h3>
            <div className="properties-list">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className={`property-item ${selectedProperty?.id === property.id ? 'active' : ''}`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <h4>{property.title}</h4>
                  <p className="property-address">{property.address || property.location}</p>
                  <button
                    className="btn-link"
                    onClick={(e) => {
                      e.stopPropagation();
                      openInGoogleMaps(property);
                    }}
                  >
                    {t('map.openInGoogleMaps') || 'Open in Google Maps'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedProperty && (
          <div className="selected-property-info">
            <h3>{selectedProperty.title}</h3>
            <p>{selectedProperty.address || selectedProperty.location}</p>
            <button
              className="btn-primary"
              onClick={() => navigate(`/property/${selectedProperty.id}`)}
            >
              {t('map.viewDetails') || 'View Details'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
