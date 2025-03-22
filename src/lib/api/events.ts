
import { fetchWithErrorHandling, API_BASE_URL } from '../apiUtils';

export const eventsApi = {
  getAll: async () => {
    // In a real implementation, you would:
    // 1. Call your backend API to get events from MongoDB
    
    return fetchWithErrorHandling(`${API_BASE_URL}/events`);
  },
  
  getByType: async (eventType: string) => {
    // In a real implementation, you would:
    // 1. Call your backend API to get a specific event from MongoDB
    
    return fetchWithErrorHandling(`${API_BASE_URL}/events/${eventType}`);
  },
};
