import axios from 'axios';
import {API_BASE_URL} from '../../constants/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// The default 'application/json' header above makes axios try to
// JSON-serialize any FormData body instead of sending it as multipart
// (React Native's FormData doesn't support the iteration that conversion
// needs, so it silently becomes the literal string "null"). Clearing the
// header for FormData requests lets axios pass the body through untouched
// so React Native's native networking layer can encode it correctly.
api.interceptors.request.use((config) => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers?.delete) {
      config.headers.delete('Content-Type');
    } else if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

export default api;