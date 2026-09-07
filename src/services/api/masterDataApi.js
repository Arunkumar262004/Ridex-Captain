import api from './axios';

const getVehicleBrands = async () => {
  const response = await api.get('/vehicle-brands');
  return response.data;
};

const getVehicleCategories = async () => {
  const response = await api.get('/vehicle-categories');
  return response.data;
};

const getLocationTree = async () => {
  const response = await api.get('/locations/tree');
  return response.data;
};

export {
  getVehicleBrands,
  getVehicleCategories,
  getLocationTree,
};
