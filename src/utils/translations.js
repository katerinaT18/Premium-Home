import { useSelector } from 'react-redux';
import enTranslations from '../translations/en.json';
import sqTranslations from '../translations/sq.json';

const translations = {
  en: enTranslations,
  sq: sqTranslations,
};

/**
 * Get translation for a given key path
 * @param {string} language - Language code ('en' or 'sq')
 * @param {string} keyPath - Dot-separated path to translation (e.g., 'header.home')
 * @param {object} params - Optional parameters for string interpolation
 * @returns {string} Translated string
 */
export const getTranslation = (language, keyPath, params = {}) => {
  const lang = language || 'en';
  const translationObj = translations[lang] || translations.en;
  
  const keys = keyPath.split('.');
  let value = translationObj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      // Fallback to English if translation not found
      const enValue = translations.en;
      let enResult = enValue;
      for (const enKey of keys) {
        if (enResult && typeof enResult === 'object' && enKey in enResult) {
          enResult = enResult[enKey];
        } else {
          return keyPath; // Return key path if translation not found
        }
      }
      value = enResult;
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return keyPath; // Return key path if value is not a string
  }
  
  // Simple parameter replacement
  let result = value;
  Object.keys(params).forEach((key) => {
    result = result.replace(`{{${key}}}`, params[key]);
  });
  
  return result;
};

/**
 * React hook to get translations based on current language from Redux
 * @returns {function} Translation function
 */
export const useTranslation = () => {
  const language = useSelector((state) => state.ui.language);
  
  const t = (keyPath, params = {}) => {
    return getTranslation(language, keyPath, params);
  };
  
  return { t, language };
};

export default getTranslation;
