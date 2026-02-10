import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllProperties, selectFeaturedProperties } from '../store/selectors/propertySelectors';
import { useTranslation } from '../utils/translations';
import { agentsAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard/PropertyCard';
import './AgentDetailsPage.css';

const AgentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const allProperties = useSelector(selectAllProperties);
  const featuredProperties = useSelector(selectFeaturedProperties);
  const [agent, setAgent] = useState(location.state?.agent || null);
  const [loading, setLoading] = useState(!location.state?.agent);
  const [error, setError] = useState(null);

  // Fetch agent from API if not passed via location state
  useEffect(() => {
    if (location.state?.agent) {
      setAgent(location.state.agent);
      setLoading(false);
      return;
    }

    const fetchAgent = async () => {
      try {
        setLoading(true);
        setError(null);
        const agentData = await agentsAPI.getById(id);
        if (agentData) {
          setAgent(agentData);
        } else {
          setError('Agent not found');
        }
      } catch (err) {
        console.error('Error fetching agent:', err);
        setError(err.message || 'Failed to load agent');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id, location.state]);

  const recentlyViewed = featuredProperties.slice(0, 3);

  // Filter properties by agent
  const agentProperties = useMemo(() => {
    if (!agent) return [];

    // Only show properties explicitly linked to this agent
    return allProperties.filter(
      (p) => p.agentId === agent.id || p.agentId === agent.adminId
    );
  }, [allProperties, agent, id]);

  // Calculate property categories from agent's properties
  const categories = useMemo(() => {
    const categoryCounts = {};
    agentProperties.forEach(property => {
      const type = property.propertyType || 'other';
      categoryCounts[type] = (categoryCounts[type] || 0) + 1;
    });

    return Object.entries(categoryCounts).map(([type, count]) => ({
      label: t(`propertyTypes.${type}`) || type,
      count,
    }));
  }, [agentProperties, t]);

  if (loading) {
    return (
      <div className="agent-details-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>{t('agents.loading') || 'Loading agent...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="agent-details-page">
        <div className="container">
          <div className="agent-not-found">
            <h2>{error || t('agents.notFound') || 'Agent not found'}</h2>
            <button onClick={() => navigate('/agents')} className="btn-primary">
              {t('agents.backToAgents') || 'Back to Agents'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            {t('header.home')}
          </button>
          <span className="breadcrumb-separator">/</span>
          <button onClick={() => navigate('/agents')} className="breadcrumb-link">
            {t('header.agents')}
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{agent.name}</span>
        </nav>

        <div className="agent-details-layout">
          <div className="agent-details-main">
            {/* Agent Info Section */}
            <div className="agent-info-section">
              <div className="agent-profile">
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
                    className="agent-profile-image"
                  />
                </div>
                <div className="agent-profile-info">
                  <div className="agent-heading">
                    <h1 className="agent-profile-name">{agent.name}</h1>
                    <div className="agent-count-pill">
                      {agentProperties.length} {t('agents.properties') || 'Prona'}
                    </div>
                  </div>
                  <p className="agent-profile-title">{agent.title}</p>
                  <div className="agent-contact-info">
                    <p className="agent-contact-item">
                      <span className="contact-icon">📞</span>
                      <span>{agent.mobile}</span>
                    </p>
                    <p className="agent-contact-item">
                      <span className="contact-icon">✉️</span>
                      <span>{agent.email}</span>
                    </p>
                    <p className="agent-contact-item">
                      <span className="contact-icon">📍</span>
                      <span>{agent.city}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Section */}
            <div className="agent-properties-section">
              <div className="section-header">
                <h2>
                  {t('agents.agentProperties') || 'Pronat nga'} {agent.name}
                </h2>
              </div>

              {agentProperties.length > 0 ? (
                <div className="properties-grid">
                  {agentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="no-properties">
                  <p>{t('agents.noProperties') || 'This agent has no properties listed yet.'}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="agent-details-sidebar">
            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('agents.contact') || 'Kontakt'}</h3>
              <p className="sidebar-subtitle">{t('agents.sendMessage') || 'Dërgo mesazhin'}</p>
              <div className="contact-box">
                <div className="contact-row">
                  <span className="contact-label">{t('agents.phone') || 'Telefon'}:</span>
                  <span className="contact-value">{agent.mobile}</span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">{t('agents.email') || 'Email'}:</span>
                  <span className="contact-value">{agent.email}</span>
                </div>
                <button
                  type="button"
                  className="btn-primary btn-full"
                  onClick={() => window.location.href = `mailto:${agent.email}`}
                >
                  {t('agents.emailAgent') || 'Email Agent'}
                </button>
              </div>
            </div>

            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('agents.featuredProperties') || 'Prona të Përzgjedhura'}</h3>
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
                          {p.transactionType === 'rent' ? (t('transactionTypes.rent') || 'Qira') : (t('transactionTypes.sale') || 'Shitje')}
                        </span>
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
              <h3 className="sidebar-title">{t('agents.categories') || 'Prona sipas kategorive'}</h3>
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

export default AgentDetailsPage;
