import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../utils/translations';
import './PropertyFormModal.css';

const PropertyFormModal = ({ isOpen, onClose, property, onSave }) => {
  const { t } = useTranslation();
  const isEditMode = !!property;

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    address: '',
    price: '',
    currency: 'EUR',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    furnished: false,
    elevator: false,
    propertyType: 'apartment',
    transactionType: 'sale',
    description: '',
    featured: false,
    images: [''],
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        location: property.location || '',
        address: property.address || '',
        price: property.price || '',
        currency: property.currency || 'EUR',
        area: property.area || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        floor: property.floor || '',
        furnished: property.furnished || false,
        elevator: property.elevator || false,
        propertyType: property.propertyType || 'apartment',
        transactionType: property.transactionType || 'sale',
        description: property.description || '',
        featured: property.featured || false,
        images: property.images && property.images.length > 0 ? property.images : [''],
      });
    } else {
      // Reset form for new property
      setFormData({
        title: '',
        location: '',
        address: '',
        price: '',
        currency: 'EUR',
        area: '',
        bedrooms: '',
        bathrooms: '',
        floor: '',
        furnished: false,
        elevator: false,
        propertyType: 'apartment',
        transactionType: 'sale',
        description: '',
        featured: false,
        images: [''],
      });
    }
  }, [property, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleImageUpload = async (index, file) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const { uploadAPI } = await import('../../services/api');
        const imageUrl = await uploadAPI.uploadImage(file);
        const newImages = [...formData.images];
        newImages[index] = imageUrl;
        setFormData({ ...formData, images: newImages });
      } catch (error) {
        console.error('Error uploading image:', error);
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImages = [...formData.images];
          newImages[index] = reader.result;
          setFormData({ ...formData, images: newImages });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
  };

  const isBase64Image = (str) => {
    return str && str.startsWith('data:image/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const propertyData = {
      ...formData,
      id: property?.id || null,
      price: parseFloat(formData.price),
      area: parseFloat(formData.area), // Already using parseFloat for decimals
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      floor: formData.floor ? parseInt(formData.floor) : null,
      furnished: formData.furnished,
      elevator: formData.elevator,
      images: formData.images.filter(img => img.trim() !== ''),
    };
    onSave(propertyData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? t('admin.form.editProperty') : t('admin.form.addProperty')}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.form.title')} *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('admin.form.titlePlaceholder') || 'e.g., Luxury Apartment in City Center'}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('admin.form.location')} *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>{t('admin.form.address')}</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.form.price')} *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>{t('admin.form.currency')}</label>
              <select name="currency" value={formData.currency} onChange={handleChange}>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.form.propertyType')} *</label>
              <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                <option value="apartment">{t('propertyTypes.apartment')}</option>
                <option value="villa">{t('propertyTypes.villa')}</option>
                <option value="office">{t('propertyTypes.office')}</option>
                <option value="land">{t('propertyTypes.land')}</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t('admin.form.transactionType')} *</label>
              <select name="transactionType" value={formData.transactionType} onChange={handleChange} required>
                <option value="sale">{t('transactionTypes.sale')}</option>
                <option value="rent">{t('transactionTypes.rent')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('admin.form.area')} (m²) *</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>{t('admin.form.bedrooms')} *</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>{t('admin.form.bathrooms')}</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>{t('admin.form.floor')}</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                min="0"
                placeholder={t('admin.form.floorPlaceholder') || 'e.g., 1, 2, 3...'}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="furnished"
                  checked={formData.furnished}
                  onChange={handleChange}
                />
                {' '}{t('admin.form.furnished')}
              </label>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="elevator"
                  checked={formData.elevator}
                  onChange={handleChange}
                />
                {' '}{t('admin.form.elevator')}
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>{t('admin.form.description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>{t('admin.form.images')}</label>
            {formData.images.map((image, index) => (
              <div key={index} className="image-upload-group">
                {image && (isBase64Image(image) || image.startsWith('http')) && (
                  <div className="image-preview">
                    <img src={image} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => handleImageChange(index, '')}
                      className="clear-image-btn"
                      title={t('admin.form.removeImage')}
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="image-input-row">
                  <input
                    type="url"
                    value={isBase64Image(image) ? '' : image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={t('admin.form.imageUrl')}
                    className="image-url-input"
                  />
                  <label className="file-upload-label">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(index, e.target.files[0]);
                        }
                      }}
                      className="file-input"
                    />
                    <span className="file-upload-button">{t('admin.form.uploadImage')}</span>
                  </label>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="remove-image-btn"
                      title={t('admin.form.removeField')}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="add-image-btn"
            >
              + {t('admin.form.addImage')}
            </button>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              {t('admin.form.featured')}
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              {t('admin.form.cancel')}
            </button>
            <button type="submit" className="btn-save">
              {isEditMode ? t('admin.form.update') : t('admin.form.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
