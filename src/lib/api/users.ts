
import { fetchWithErrorHandling, API_BASE_URL } from '../apiUtils';

export const usersApi = {
  getProfile: async () => {
    // In a real implementation, you would:
    // 1. Call your backend API which would get the user's profile data from MongoDB
    
    const token = localStorage.getItem('kalakriti-token');
    
    return fetchWithErrorHandling(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  },
  
  updateProfile: async (profileData: any) => {
    // In a real implementation, you would:
    // 1. Call your backend API which would update the user's profile in MongoDB
    
    const token = localStorage.getItem('kalakriti-token');
    
    return fetchWithErrorHandling(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
  },
};
