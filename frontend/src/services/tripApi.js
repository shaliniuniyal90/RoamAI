import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export async function generateTrip(tripParams) {
  try {
    const response = await apiClient.post('/api/generate-trip', tripParams);
    if (!response.data?.success) {
      throw new Error(response.data?.error || 'Failed to generate itinerary.');
    }
    return response.data.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Something went wrong while generating your trip.';
    throw new Error(message);
  }
}

export default apiClient;