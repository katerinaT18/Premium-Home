import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setPropertyType, setTransactionType, setCity, setApartmentType } from '../../store/slices/filtersSlice';
import { useTranslation } from '../../utils/translations';
import './Hero.css';

const Hero = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const { t } = useTranslation();

  const [localSearch, setLocalSearch] = useState('');
  const [showApartmentSubmenu, setShowApartmentSubmenu] = useState(false);

  // Reset apartment type when property type changes
  useEffect(() => {
    if (filters.propertyType !== 'apartment') {
      dispatch(setApartmentType('all'));
      setShowApartmentSubmenu(false);
    }
  }, [filters.propertyType, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const handlePropertyTypeChange = (value) => {
    dispatch(setPropertyType(value));
    if (value === 'apartment') {
      setShowApartmentSubmenu(true);
    } else {
      setShowApartmentSubmenu(false);
    }
  };

  const handleApartmentTypeSelect = (apartmentType) => {
    dispatch(setApartmentType(apartmentType));
    setShowApartmentSubmenu(false);
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            {t('hero.title')}
          </h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>

          <div className="hero-search">
            <div className="search-tabs">
              <button
                type="button"
                className={`tab ${filters.transactionType === 'sale' ? 'active' : ''}`}
                onClick={() => dispatch(setTransactionType('sale'))}
              >
                {t('hero.sale')}
              </button>
              <button
                type="button"
                className={`tab ${filters.transactionType === 'rent' ? 'active' : ''}`}
                onClick={() => dispatch(setTransactionType('rent'))}
              >
                {t('hero.rent')}
              </button>
              <button
                type="button"
                className={`tab ${filters.transactionType === 'all' ? 'active' : ''}`}
                onClick={() => dispatch(setTransactionType('all'))}
              >
                {t('common.all')}
              </button>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-fields">
                <div className="search-field">
                  <label>{t('hero.searchProperty')}</label>
                  <input
                    type="text"
                    placeholder={t('hero.locationPlaceholder')}
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>

                <div 
                  className="search-field property-type-field"
                  onMouseEnter={() => {
                    if (filters.propertyType === 'apartment') {
                      setShowApartmentSubmenu(true);
                    }
                  }}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      const submenu = document.querySelector('.apartment-submenu:hover');
                      if (!submenu) {
                        setShowApartmentSubmenu(false);
                      }
                    }, 200);
                  }}
                >
                  <label>{t('hero.type')}</label>
                  <div className="custom-select-wrapper">
                    <select
                      value={filters.propertyType}
                      onChange={(e) => handlePropertyTypeChange(e.target.value)}
                    >
                      <option value="all">{t('common.all')}</option>
                      <option value="apartment">{t('propertyTypes.apartment')}</option>
                      <option value="villa">{t('propertyTypes.villa')}</option>
                      <option value="office">{t('propertyTypes.office')}</option>
                      <option value="land">{t('propertyTypes.land')}</option>
                    </select>
                    {filters.propertyType === 'apartment' && (
                      <div 
                        className={`apartment-submenu ${showApartmentSubmenu ? 'show' : ''}`}
                        onMouseEnter={() => setShowApartmentSubmenu(true)}
                        onMouseLeave={() => setShowApartmentSubmenu(false)}
                      >
                        <div 
                          className={`submenu-item ${filters.apartmentType === 'all' ? 'active' : ''}`}
                          onClick={() => handleApartmentTypeSelect('all')}
                        >
                          {t('common.all')}
                        </div>
                        <div 
                          className={`submenu-item ${filters.apartmentType === '1+1' ? 'active' : ''}`}
                          onClick={() => handleApartmentTypeSelect('1+1')}
                        >
                          1+1
                        </div>
                        <div 
                          className={`submenu-item ${filters.apartmentType === '2+1' ? 'active' : ''}`}
                          onClick={() => handleApartmentTypeSelect('2+1')}
                        >
                          2+1
                        </div>
                        <div 
                          className={`submenu-item ${filters.apartmentType === '3+1' ? 'active' : ''}`}
                          onClick={() => handleApartmentTypeSelect('3+1')}
                        >
                          3+1
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="search-field">
                  <label>{t('hero.city')}</label>
                  <select
                    value={filters.city}
                    onChange={(e) => dispatch(setCity(e.target.value))}
                  >
                    <option value="all">{t('hero.allCities')}</option>
                    <option value="Tirana">Tirana</option>
                    <option value="Durrës">Durrës</option>
                    <option value="Vlorë">Vlorë</option>
                    <option value="Shkodër">Shkodër</option>
                    <option value="Sarandë">Sarandë</option>
                    <option value="Pogradec">Pogradec</option>
                  </select>
                </div>

                <button type="submit" className="search-button">
                  {t('common.search')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
