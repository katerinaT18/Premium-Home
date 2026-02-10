import React, { useMemo, useState, useEffect } from 'react';
import { useTranslation } from '../utils/translations';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFeaturedProperties } from '../store/selectors/propertySelectors';
import { agentsAPI } from '../services/api';
import './AgentsPage.css';

const AgentsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const featuredProperties = useSelector(selectFeaturedProperties);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await agentsAPI.getAll();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setAgents(data);
        } else {
          console.warn('Agents API returned non-array data:', data);
          setAgents([]);
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
        // Don't show error if it's just an empty array
        if (err.message && !err.message.includes('empty')) {
          setError(err.message || 'Failed to load agents');
        }
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = selectedCity === 'all' || agent.city === selectedCity;
      return matchesSearch && matchesCity;
    });
  }, [agents, searchQuery, selectedCity]);

  // Extract unique cities from agents
  const cities = useMemo(() => {
    const uniqueCities = ['all', ...new Set(agents.map(a => a.city).filter(Boolean))];
    return uniqueCities;
  }, [agents]);

  const categories = [
    { label: t('propertyTypes.apartment') || 'Apartment', count: 6 },
    { label: t('propertyTypes.villa') || 'Villa', count: 26 },
    { label: t('propertyTypes.office') || 'Office', count: 12 },
    { label: t('propertyTypes.land') || 'Land', count: 8 },
  ];

  const recentlyViewed = featuredProperties.slice(0, 3);

  if (loading) {
    return (
      <div className="agents-page">
        <div className="container">
          <div className="agents-header">
            <h1>{t('agents.title') || 'Agjentët'}</h1>
            <p className="agents-subtitle">{t('agents.subtitle') || 'Gjeni agjentin tuaj ideal'}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>{t('agents.loading') || 'Loading agents...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="agents-page">
        <div className="container">
          <div className="agents-header">
            <h1>{t('agents.title') || 'Agjentët'}</h1>
            <p className="agents-subtitle">{t('agents.subtitle') || 'Gjeni agjentin tuaj ideal'}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ 
              background: 'rgba(220, 53, 69, 0.1)', 
              border: '2px solid rgba(220, 53, 69, 0.3)', 
              borderRadius: '8px', 
              padding: '1.5rem',
              color: '#dc3545',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <h3 style={{ marginTop: 0 }}>Error Loading Agents</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{error}</p>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                Please make sure the backend server is running on port 5001.
                <br />
                <br />
                To start the backend server, run:
                <br />
                <code style={{ 
                  background: 'rgba(0,0,0,0.1)', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  display: 'inline-block',
                  marginTop: '0.5rem'
                }}>
                  cd backend && JWT_SECRET=premium-homes-secret-key-change-in-production PORT=5001 node server.js
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agents-page">
      <div className="container">
        <div className="agents-header">
          <h1>{t('agents.title') || 'Agjentët'}</h1>
          <p className="agents-subtitle">{t('agents.subtitle') || 'Gjeni agjentin tuaj ideal'}</p>
        </div>

        <div className="agents-layout">
          <div className="agents-main">
            <div className="agents-filters">
              <div className="filter-group">
                <label>{t('agents.findAgent') || 'Find Agent'}</label>
                <input
                  type="text"
                  placeholder={t('agents.searchPlaceholder') || 'Search by name or title...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <div className="filter-group">
                <label>{t('agents.city') || 'City'}</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="city-select"
                >
                  <option value="all">{t('agents.allCities') || 'All Cities'}</option>
                  {cities
                    .filter((c) => c !== 'all')
                    .map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="agents-results">
              {agents.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '2px solid var(--border-color)'
                }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
                    There are no agents
                  </p>
                </div>
              ) : (
                <>
                  <p className="results-count">
                    {filteredAgents.length} {t('agents.agentsFound') || 'agents found'}
                  </p>

                  {filteredAgents.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '2rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <p>{t('agents.noMatchingAgents') || 'No agents match your search criteria.'}</p>
                    </div>
                  ) : (
                    <div className="agents-grid">
                      {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="agent-card"
                    onClick={() => navigate(`/agent/${agent.id}`, { state: { agent } })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') navigate(`/agent/${agent.id}`, { state: { agent } });
                    }}
                  >
                    <div className="agent-image-container">
                      <img
                        src={agent.image}
                        alt={agent.name}
                        onError={(e) => {
                          e.target.src =
                            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3E' +
                            encodeURIComponent(agent.name.charAt(0)) +
                            '%3C/text%3E%3C/svg%3E';
                        }}
                        className="agent-image"
                      />
                    </div>
                    <div className="agent-info">
                      <h3 className="agent-name">{agent.name}</h3>
                      <p className="agent-title">{agent.title}</p>
                      <div className="agent-details">
                        <p className="agent-properties">
                          {agent.propertiesCount} {t('agents.properties') || 'Prona'}
                        </p>
                        <p className="agent-mobile">📞 {agent.mobile}</p>
                        <p className="agent-email">✉️ {agent.email}</p>
                      </div>
                      <button
                        className="view-properties-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/agent/${agent.id}`, { state: { agent } });
                        }}
                      >
                        {t('agents.viewProperties') || 'View Properties'}
                      </button>
                    </div>
                  </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <aside className="agents-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('agents.featuredProperties') || 'Featured Properties'}</h3>
              <div className="sidebar-list">
                {featuredProperties.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    className="sidebar-property"
                    onClick={() => navigate(`/property/${p.id}`)}
                    type="button"
                  >
                    <div className="sidebar-thumb">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.title} />
                      ) : (
                        <div className="sidebar-thumb-fallback">🏠</div>
                      )}
                    </div>
                    <div className="sidebar-property-info">
                      <div className="sidebar-badges">
                        <span className="sidebar-badge">
                          {p.transactionType === 'rent' ? (t('transactionTypes.rent') || 'Rent') : (t('transactionTypes.sale') || 'Sale')}
                        </span>
                        {p.featured && <span className="sidebar-badge featured">{t('propertyDetails.reserved') || 'Featured'}</span>}
                      </div>
                      <div className="sidebar-property-title">{p.title}</div>
                      <div className="sidebar-property-meta">{p.location}</div>
                    </div>
                  </button>
                ))}
                {featuredProperties.length === 0 && (
                  <div className="sidebar-empty">{t('agents.noFeatured') || 'No featured properties yet.'}</div>
                )}
              </div>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('agents.categories') || 'Categories Property'}</h3>
              <div className="sidebar-categories">
                {categories.map((c) => (
                  <div key={c.label} className="sidebar-category">
                    <span>{c.label}</span>
                    <span className="sidebar-category-count">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('agents.recentlyViewed') || 'Recently Viewed'}</h3>
              <div className="sidebar-list">
                {recentlyViewed.map((p) => (
                  <button
                    key={p.id}
                    className="sidebar-property"
                    onClick={() => navigate(`/property/${p.id}`)}
                    type="button"
                  >
                    <div className="sidebar-thumb">
                      {p.images && p.images[0] ? (
                        <img src={p.images[0]} alt={p.title} />
                      ) : (
                        <div className="sidebar-thumb-fallback">🏠</div>
                      )}
                    </div>
                    <div className="sidebar-property-info">
                      <div className="sidebar-property-title">{p.title}</div>
                      <div className="sidebar-property-meta">{p.location}</div>
                    </div>
                  </button>
                ))}
                {recentlyViewed.length === 0 && (
                  <div className="sidebar-empty">{t('agents.noRecent') || 'No recently viewed properties yet.'}</div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
