import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSortBy } from '../../store/slices/filtersSlice';
import { selectFilteredProperties, selectPropertiesLoading } from '../../store/selectors/propertySelectors';
import { useTranslation } from '../../utils/translations';
import PropertyCard from '../PropertyCard/PropertyCard';
import './PropertyList.css';

const PropertyList = () => {
  const dispatch = useDispatch();
  const filteredAndSortedProperties = useSelector(selectFilteredProperties);
  const loading = useSelector(selectPropertiesLoading);
  const filters = useSelector((state) => state.filters);
  const { t } = useTranslation();

  if (loading) {
    return (
      <section className="property-list-section">
        <div className="container">
          <div className="loading-state">
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="property-list-section">
      <div className="container">
        <div className="section-header">
          <h2>{t('propertyList.availableProperties')}</h2>
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

        {filteredAndSortedProperties.length > 0 ? (
          <div className="property-grid">
            {filteredAndSortedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="no-properties">
            <p>{t('propertyList.noPropertiesFound')}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyList;
