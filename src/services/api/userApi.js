import api from './axios';

/**
 * Reports this captain's live position while they're online. Also implicitly
 * marks them online server-side, so pings are all this needs to send.
 */
const updateCaptainLocation = async ({ latitude, longitude }) => {
  const response = await api.post('/users/captain-location', { latitude, longitude });
  return response.data;
};

/**
 * Flips the captain offline immediately (rather than waiting for their last
 * location ping to go stale) so they stop showing up as a nearby partner.
 */
const setCaptainOffline = async () => {
  const response = await api.post('/users/captain-offline');
  return response.data;
};

export { updateCaptainLocation, setCaptainOffline };
