
import { fetchWithErrorHandling, API_BASE_URL } from '../apiUtils';

export const authApi = {
  // Login using MongoDB
  login: async (email: string, password: string) => {
    try {
      // In a real implementation, you would:
      // 1. Call an API endpoint that connects to your MongoDB
      // 2. That endpoint would verify credentials and return a JWT token
      
      const data = await fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      localStorage.setItem('kalakriti-token', data.token);
      localStorage.setItem('kalakriti-user', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Signup using MongoDB
  signup: async (userData: any) => {
    try {
      // In a real implementation, you would:
      // 1. Call an API endpoint that connects to your MongoDB
      // 2. That endpoint would hash the password, store user data, and return a result
      
      return fetchWithErrorHandling(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  getCurrentUser: () => {
    const userString = localStorage.getItem('kalakriti-user');
    return userString ? JSON.parse(userString) : null;
  },
  
  logout: () => {
    localStorage.removeItem('kalakriti-token');
    localStorage.removeItem('kalakriti-user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('kalakriti-token');
  },
};
