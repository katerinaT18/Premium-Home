import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSortBy } from '../store/slices/filtersSlice';
import { selectAllProperties, selectPropertiesLoading } from '../store/selectors/propertySelectors';
import { sortProperties } from '../utils/propertyHelpers';
import { useTranslation } from '../utils/translations';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import './PropertiesPage.css';

const PropertiesPage = () => {
  const dispatch = useDispatch();
  const allProperties = useSelector(selectAllProperties);
  const loading = useSelector(selectPropertiesLoading);
  const filters = useSelector((state) => state.filters);
  const { t } = useTranslation();
  
  // Show all properties, sorted by user preference
  const sortedProperties = sortProperties(allProperties, filters.sortBy);

  if (loading) {
    return (
      <div className="properties-page">
        <div className="container">
          <div className="loading-state">
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('propertyList.availableProperties')}</h1>
          <p>{t('propertyList.subtitle') || 'Browse all available properties'}</p>
        </div>

        <div className="section-header">
          <div className="results-count">
            <p>{sortedProperties.length} {t('propertyList.propertiesFound') || 'properties found'}</p>
          </div>
          <div className="sort-controls">
            <label>{t('propertyList.sortBy')}</label>
            <select
              value={filters.sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
            >
              <option value="newest">{t('propertyList.newest')}</option>
              <option value="price-low">{t('propertyList.priceLow')}</option>
              <option value="price-high">{t('propertyList.priceHigh')}</option>
            </select>
          </div>
        </div>

        {sortedProperties.length > 0 ? (
          <div className="property-grid">
            {sortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="no-properties">
            <p>{t('propertyList.noPropertiesFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
